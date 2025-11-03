// @ts-ignore
import AgoraRTC from 'agora-rtc-sdk-ng';

export const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

export const initLocalAudioTrack = async () => {
  const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  return localAudioTrack;
};
