export async function playAudio(sound: string): Promise<void> {
    const audioContext = new (window.AudioContext)();
    const response = await fetch(`/sounds/${sound}.webm`);
    const data = await response.arrayBuffer();
    const buffer = await audioContext.decodeAudioData(data);

    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    source.connect(audioContext.destination);
    source.start();
    setTimeout(() => source.disconnect(), 2000);
}