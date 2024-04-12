import React, { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [video, setVideo] = useState();
  const [ready, setReady] = useState(false);
  const [gif, setGif] = useState();
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(5);
  const [downloadUrl, setDownloadUrl] = useState();
  const [downloadName, setDownloadName] = useState();

  const convertToWaveform = async () => {
    ffmpeg.FS('writeFile', 'noob.mov', await fetchFile(video));
    await ffmpeg.run('-i', 'noob.mov', '-filter_complex', 'showwavespic', '-frames:v', '1', 'waveform.png');
    const data = ffmpeg.FS('readFile', 'waveform.png');
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/png' }));
    setGif(url);
    setDownloadUrl(url);
    setDownloadName('waveform.png');
  }

  const convertToGif = async () => {
    ffmpeg.FS('writeFile', 'test.mov', await fetchFile(video));
    await ffmpeg.run(
      '-i', 'test.mov',
      '-ss', startTime.toString(),
      '-t', (endTime - startTime).toString(),
      '-f', 'gif', 'trimmed_gif.gif'
    );
    const data = ffmpeg.FS('readFile', 'trimmed_gif.gif');
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    setGif(url);
    setDownloadUrl(url);
    setDownloadName('trimmed_gif.gif');
  }

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    function addTrialToken(tokenContents) {
      const tokenElement = document.createElement('meta');
      tokenElement.httpEquiv = 'origin-trial';
      tokenElement.content = tokenContents;
      document.head.appendChild(tokenElement);
    }
    addTrialToken("AoYEjbnbbcEGhtWRYUEliEA/4hSMEkJlBS/UvgFL0BorISkVGZ7Xh6oxuQl+HEB5/YdGLTBeHccro4Ly57Pz0gwAAACAeyJvcmlnaW4iOiJodHRwczovL2ZmbXBlZy1ncmFwaGVyLndlYi5hcHA6NDQzIiwiZmVhdHVyZSI6IlVucmVzdHJpY3RlZFNoYXJlZEFycmF5QnVmZmVyIiwiZXhwaXJ5IjoxNzE5MzU5OTk5LCJpc1N1YmRvbWFpbiI6dHJ1ZX0=")
    load();
  }, [])

  useEffect(() => {
    if (video || gif) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [video, gif])

  return ready ? (
    <div className="App">
      <div>
        <p className="font-mono p-52 text-6xl mt-4 text-center">The Video Grapher</p>
      </div>

      {video && (
        <div className='flex space-x-4 justify-center mt-10'>
          <video
            className='m-6 text-center'
            controls
            fluid={false}
            width={480}
            height={272}
            src={URL.createObjectURL(video)}>
          </video>
        </div>
      )}

      <input
        id='myInput'
        className='text-center justify-between my-4'
        type="file"
        name='Upload Video'
        onChange={(e) => {
          const item = e.target.files?.item(0);
          setVideo(item);
        }}
        style={{ display: 'none' }}
      />
      <label htmlFor="myInput" className='mt-4 h-5'>Upload Video</label>

      {video && (
        <div className='flex space-x-4 justify-center mt-10'>
          <button onClick={convertToGif}>Make GIF</button>
          <button onClick={convertToWaveform}>Make Audio Waveform</button>
        </div>
      )}

      {video && (
        <div className='flex space-x-4 justify-center mt-4 p-1'>
          <label htmlFor="startTime">Start Time (s):</label>
          <input
            id="startTime"
            type="number"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className='ml-2 p-1'
          />

          <label htmlFor="endTime" className='ml-4'>End Time (s):</label>
          <input
            id="endTime"
            type="number"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className='ml-2 p-1'
          />
        </div>
      )}

      <div className='flex space-x-4 justify-center mt-10'>
        {gif && <img src={gif} className='text-center justify-center mt-10' alt="Generated GIF" />}
      </div>

      {downloadUrl && (
        <div className='flex space-x-4 justify-center mt-10'>
          <a href={downloadUrl} download={downloadName}>
            <button>Download</button>
          </a>
        </div>
      )}
    </div>
  ) : (<p>Loading...</p>);
}

export default App;
