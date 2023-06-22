import React, { useState, useEffect, useRef } from 'react';
import { data } from './data';
import { Header } from "./components/Header";
import { AudioPlayer } from './components/AudioPlayer';
import { DocumentViewer } from './components/DocumentViewer';
import { VideoPlayer } from './components/VideoPlayer';
import { ImageViewer } from './components/ImageViewer';
import { Pie, Bar } from 'react-chartjs-2';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
} from 'react-share';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function App() {
  const [myFiles, setMyFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePath] = useState("/file-server/")
  const [showChartModal, setShowChartModal] = useState(false)
  const inputRef = useRef()
  let currentId = 6

  useEffect(() => {
    setMyFiles(data)
  }, [])

  const handleNewFile = (event) => {
    if (event.target.files[0].size / 1024 <= 5120) {
      const reader = new FileReader()
      const file = event.target.files[0]
      const type = file.type.split('/')[0]
      const name = file.name.split('.')[0] + ' (NEW)'
      reader.readAsDataURL(file)
      reader.addEventListener("load", () => {
        if (reader.result) {
          const newFile = {
            id: currentId + 1,
            name,
            type,
            path: reader.result
          }
          currentId += 1
          const newArray = [...myFiles, newFile]
          setMyFiles(newArray)
          console.log('file size', type)
        } else {
          alert("Ooops, something went wrong")
        }
      })
    } else {
      alert("File size is too large " + event.target.files[0].size / 1024)
    }
  }

  var barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Files Breakdown',
      },
    },
  };

  return (
    <>
      {showChartModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <p style={{ fontWeight: "bold" }}>Files Breakdown</p>
              <button style={styles.closeButton} onClick={() => setShowChartModal(false)}>close</button>
            </div>
            <div style={styles.modalBody}>
              <Pie
                data={{
                  labels: ['Video', 'Audio', 'Document', 'Image'],
                  datasets: [
                    {
                      label: 'Files Breakdown',
                      data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
              <Bar
                data={{
                  labels: ['Video', 'Audio', 'Document', 'Image'],
                  datasets: [
                    {
                      label: 'Files Breakdown',
                      data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={barChartOptions}
              />
            </div>
          </div>
        </div>
      )}
      <div className="App">
        <Header />
        <div style={styles.container}>
          <div style={{ padding: 10, paddingBottom: 0, }}>
            <p style={{ fontWeight: "bold" }}>My Files</p>
            <p>{selectedFile ? selectedFile.path.indexOf(filePath) ? 'temporary file' : selectedFile.path : filePath}</p>
          </div>
          <div style={styles.controlTools}>
            <input
              type='file'
              hidden
              onChange={(event) => handleNewFile(event)}
              ref={inputRef} />
            <button style={styles.controlButton}
              onClick={() => {
                inputRef.current.click()
              }}
            >+ Add File</button>
            <button style={styles.controlButton}
              onClick={() => {
                if (selectedFile) {
                  const newFiles = myFiles.map(file => {
                    if (file.id === selectedFile.id) {
                      return {
                        ...file,
                        name: prompt("Enter new name")
                      }
                    }
                    return file
                  })
                  setMyFiles(newFiles)
                  setSelectedFile(null)
                }
              }}
            >Rename</button>
            <button style={styles.controlButton}
              onClick={() => {
                setShowChartModal(true)
              }}
            >Files Breakdown</button>
            <button style={styles.controlButton}
              onClick={() => {
                if (selectedFile) {
                  window.open(selectedFile.path, "_blank")
                }
              }}
            >Download</button>
            {selectedFile && (
              <button style={styles.controlButton}
                onClick={() => {
                  if (selectedFile) {
                    const index = myFiles.indexOf(selectedFile)
                    if (index > -1) {
                      myFiles.splice(index, 1)
                    }
                    setMyFiles(myFiles)
                    setSelectedFile(null)
                  } else {
                    alert("No files selected")
                  }
                }}
              >Delete</button>
            )}
          </div>
          <div style={styles.fileContainer}>
            <div style={{ width: "100%", padding: 10 }}>
              {myFiles.map((file) => {

                // if (file.path.slice(0, filePath.length) === filePath) {
                return (
                  <div style={styles.file} className="files" key={file.id} onClick={() => {
                    if (selectedFile && selectedFile.id === file.id) {
                      setSelectedFile(null)
                      return
                    }
                    setSelectedFile(file)
                  }}>
                    <p>{file.name}</p>
                  </div>
                )
                // }
              })}
            </div>
            {selectedFile && (
              <div style={styles.fileViewer}>
                {selectedFile.type === 'video' && (
                  <VideoPlayer path={selectedFile.path} />
                )}
                {selectedFile.type === 'audio' && (
                  <AudioPlayer path={selectedFile.path} />
                )}
                {selectedFile.type === 'document' && (
                  <DocumentViewer path={selectedFile.path} />
                )}
                {selectedFile.type === 'image' && (
                  <ImageViewer path={selectedFile.path} />
                )}
                <p style={{ fontWeight: "bold", marginTop: 10 }}>{selectedFile.name}</p>
                <p>path: <span style={{ fontStyle: "italic" }}>{selectedFile.path.indexOf(filePath) ? 'temporary file' : selectedFile.path}</span></p>
                <p>file type: <span style={{ fontStyle: "italic" }}>{selectedFile.type}</span></p>
                <div style={styles.btnShare}>
                  <FacebookShareButton url={window.location.href + selectedFile.path.substring(1)} quote={selectedFile.name}>
                    <FacebookIcon size={24} round={true} />
                  </FacebookShareButton>
                  <TwitterShareButton url={window.location.href + selectedFile.path.substring(1)} title={selectedFile.name}>
                    <TwitterIcon size={24} round={true} />
                  </TwitterShareButton>
                  <WhatsappShareButton url={window.location.href + selectedFile.path.substring(1)} title={selectedFile.name}>
                    <WhatsappIcon size={24} round={true} />
                  </WhatsappShareButton>
                  <TelegramShareButton url={window.location.href + selectedFile.path.substring(1)} title={selectedFile.name}>
                    <TelegramIcon size={24} round={true} />
                  </TelegramShareButton>
                </div>
              </div>

            )}
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    color: '#000',
  },
  fileContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',

  },
  file: {
    backgroundColor: '#eee',
    padding: '10px',
    marginBottom: '10px',
    cursor: 'pointer',
    width: '100%',
  },
  fileViewer: {
    padding: '10px',
    margin: '10px',
    width: '30vw',
    height: '100vh',
    cursor: 'pointer',
    borderLeft: '1px solid #000'
  },
  controlTools: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '10px',
  },
  controlButton: {
    padding: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  btnShare: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: '10px'
  },
};