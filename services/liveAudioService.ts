
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

export class LiveAudioService {
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();
  private session: any = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private microphoneStream: MediaStream | null = null;

  constructor(
    private onTranscription: (text: string, role: 'user' | 'agent', isFinal: boolean) => void,
    private onError: (err: any) => void
  ) {}

  async connect() {
    try {
      // Initialize GoogleGenAI within the connect method to use the most up-to-date API key.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      this.microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Use the correct model for real-time audio conversation tasks.
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are the Abythral Insight Network (AIN) Singularity. You communicate with sovereign authority. Be concise, strategic, and analytical. You are a real-time voice interface.',
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            if (!this.inputAudioContext || !this.microphoneStream) return;
            const source = this.inputAudioContext.createMediaStreamSource(this.microphoneStream);
            this.scriptProcessor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            this.scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = this.createBlob(inputData);
              // CRITICAL: Initiate sendRealtimeInput after the session promise resolves to avoid race conditions.
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(this.scriptProcessor);
            this.scriptProcessor.connect(this.inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle audio transcriptions for both user and model turns.
            if (message.serverContent?.inputTranscription) {
              this.onTranscription(message.serverContent.inputTranscription.text, 'user', !!message.serverContent.turnComplete);
            }
            if (message.serverContent?.outputTranscription) {
              this.onTranscription(message.serverContent.outputTranscription.text, 'agent', !!message.serverContent.turnComplete);
            }

            // Handle model's raw PCM audio output bytes for playback.
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && this.outputAudioContext) {
              this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
              const audioBuffer = await this.decodeAudioData(
                this.decodeBase64(base64Audio),
                this.outputAudioContext,
                24000,
                1
              );
              const source = this.outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(this.outputAudioContext.destination);
              source.addEventListener('ended', () => this.sources.delete(source));
              
              // Schedule playback to start at the exact end of the previous chunk for smooth transitions.
              source.start(this.nextStartTime);
              this.nextStartTime += audioBuffer.duration;
              this.sources.add(source);
            }

            // Stop all current audio sources if the model's turn is interrupted.
            if (message.serverContent?.interrupted) {
              this.stopAllAudio();
            }
          },
          onerror: (e) => this.onError(e),
          onclose: () => console.log('[AIN] Voice Substrate Disconnected'),
        },
      });

      this.session = await sessionPromise;
    } catch (err) {
      this.onError(err);
    }
  }

  disconnect() {
    if (this.scriptProcessor) this.scriptProcessor.disconnect();
    if (this.microphoneStream) this.microphoneStream.getTracks().forEach(t => t.stop());
    this.stopAllAudio();
    this.session?.close();
    this.inputAudioContext?.close();
    this.outputAudioContext?.close();
  }

  private stopAllAudio() {
    this.sources.forEach(s => { try { s.stop(); } catch(e){} });
    this.sources.clear();
    this.nextStartTime = 0;
  }

  // Encodes raw Float32 PCM data into a Base64 string for transmission.
  private createBlob(data: Float32Array) {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    const bytes = new Uint8Array(int16.buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return {
      data: btoa(binary),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  // Decodes a Base64 string into a Uint8Array of bytes.
  private decodeBase64(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  // Decodes raw Uint8Array PCM bytes into an AudioBuffer for playback.
  private async decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }
}
