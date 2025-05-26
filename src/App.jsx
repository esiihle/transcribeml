import { useState, useRef, useEffect } from 'react'
import HomePage from './components/HomePage'
import Header from './components/Header'
import FileDisplay from './components/FileDisplay'
import Information from './components/Information'
import Transcribing from './components/Transcribing'
import { MessageTypes } from './utils/presets'

function App() {
  const [file, setFile] = useState(null)
  const [audioStream, setAudioStream] = useState(null)
  const [output, setOutput] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)

  const isAudioAvailable = file || audioStream

  function handleAudioReset() {
    setFile(null)
    setAudioStream(null)
    setOutput(null)
    setDownloading(false)
    setLoading(false)
    setFinished(false)
  }

  const worker = useRef(null)

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./utils/whisper.worker.js', import.meta.url), {
        type: 'module'
      })
    }

    const onMessageReceived = async (e) => {
      switch (e.data.type) {
        case MessageTypes.DOWNLOADING:
          setDownloading(true)
          console.log('DOWNLOADING MODEL...')
          break
        case MessageTypes.LOADING:
          setLoading(true)
          console.log('LOADING MODEL & TRANSCRIBING...')
          break
        case MessageTypes.RESULT:
          setOutput(e.data.results)
          console.log('TRANSCRIPTION RESULT:', e.data.results)
          break
        case MessageTypes.INFERENCE_DONE:
          setFinished(true)
          setLoading(false)
          console.log("INFERENCE COMPLETE")
          break
        case MessageTypes.ERROR:
          console.error('Worker error:', e.data.message);
          setLoading(false);
          setDownloading(false);
          alert(`Error: ${e.data.message}. Please try again or check your audio file.`);
          break;
      }
    }

    worker.current.addEventListener('message', onMessageReceived)

    return () => worker.current.removeEventListener('message', onMessageReceived)
  }, [])

  async function readAudioFrom(file) {
    const sampling_rate = 16000
    const audioCTX = new AudioContext({ sampleRate: sampling_rate })
    const response = await file.arrayBuffer()
    const decoded = await audioCTX.decodeAudioData(response)
    const audio = decoded.getChannelData(0)
    return audio
  }

  async function handleFormSubmission() {
    if (!file && !audioStream) {
      alert("Please record audio or select a file to transcribe.");
      return
    }

    setOutput(null);
    setFinished(false);
    setLoading(false);
    setDownloading(false);

    try {
      const audio = await readAudioFrom(file ? file : audioStream)
      const model_name = `openai/whisper-tiny.en`

      worker.current.postMessage({
        type: MessageTypes.INFERENCE_REQUEST,
        audio,
        model_name
      })
    } catch (error) {
      console.error("Error preparing audio for transcription:", error);
      alert("Could not process audio. Please try another file or recording.");
      setLoading(false);
      setDownloading(false);
    }
  }

  return (
    // MODIFIED THIS DIV: Added min-h-screen, bg-gray-900, text-gray-100, font-sans
    <div className='flex flex-col max-w-[1000px] mx-auto w-full min-h-screen bg-gray-900 text-gray-100 font-sans'>
      <section className='min-h-screen flex flex-col'>
        <Header />
        {output ? (
          <Information output={output} finished={finished} />
        ) : loading || downloading ? (
          <Transcribing downloading={downloading} />
        ) : isAudioAvailable ? (
          <FileDisplay handleFormSubmission={handleFormSubmission} handleAudioReset={handleAudioReset} file={file} audioStream={audioStream} />
        ) : (
          <HomePage setFile={setFile} setAudioStream={setAudioStream} />
        )}
      </section>
      {/* Added a simple footer for balance */}
      <footer className='py-4 text-center text-gray-500 text-sm'>
        &copy; {new Date().getFullYear()} MyTranscribe.
      </footer>
    </div>
  )
}

export default App