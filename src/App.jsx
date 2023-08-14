import React, { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true
});

function App() {
  const [video, setVideo] = useState();
  const [ready, setReady] = useState(false);
  const [gif, setGif] = useState();

  const convertToWaveform = async () => {
    ffmpeg.FS('writeFile', 'noob.mov' , await fetchFile(video));
    await ffmpeg.run('-i', 'noob.mov', '-filter_complex', 'showwavespic', '-frames:v', '1', 'output.png')
    const data = ffmpeg.FS('readFile', 'output.png');
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    setGif(url)
  }

  const convertToGif = async () => {
    ffmpeg.FS('writeFile', 'test.mov', await fetchFile(video));
    await ffmpeg.run('-i', 'test.mov', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');
    const data = ffmpeg.FS('readFile', 'out.gif');
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    setGif(url)
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
    addTrialToken("AgDi8VIu6wohuoHEIlfO1mpNxW7+MH8EHRkkv8mxNxpRsMBxW13lte2NZ4tDPPfIz1q1ewrscBZCQVksBvNUxAMAAACAeyJvcmlnaW4iOiJodHRwczovL2ZmbXBlZy1ncmFwaGVyLndlYi5hcHA6NDQzIiwiZmVhdHVyZSI6IlVucmVzdHJpY3RlZFNoYXJlZEFycmF5QnVmZmVyIiwiZXhwaXJ5IjoxNzA5ODU1OTk5LCJpc1N1YmRvbWFpbiI6dHJ1ZX0=")
    load();
  }, [])


  const [data, setData] = useState();
  const [fileName, setFileName] = useState();

  useEffect(() => {
    if (video || gif || fileName) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [video, gif, fileName])



  return ready ? (
    
      <div className="App">

        <div>
        <p className="font-mono p-52 text-6xl mt-4 text-center"> The Video Grapher</p>
        </div>

       
        { video && ( <div className='flex space-x-4 justify-center mt-10'><video
            className='m-6 text-center'
            controls
            fluid={false}
            width={480}
            height={272}
            src={URL.createObjectURL(video)}>

        </video></div>
        ) 
        }
        

        <input id='myInput' className='text-center justify-between my-4' type="file" name='Upload File' onChange={(e) => {
          const item = e.target.files?.item(0)
          setFileName(item.name)
          setVideo(item)
        }} 
        style={{display: 'none '}} 
        />
        <label htmlFor="myInput" className='mt-4 h-5 '>Upload File</label>
        {video && (
          <div className='flex space-x-4 justify-center mt-10'>
            <button onClick={convertToGif}>Make GIF</button>
            <button onClick={convertToWaveform}>Make Audio Waveform</button>
          </div>
        )}
        <div className='flex space-x-4 justify-center mt-10'>
        { gif && <img src={gif} className='text-center justify-center mt-10' />}
        </div>
      </div>

  ) : ( <p>Loading...</p> );
}

export default App;