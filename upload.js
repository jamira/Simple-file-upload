import axios from "axios"

export function setupFileUploader() {
  const handleFormUpload = document.getElementById("handleFormUpload")
  const inputPassword = document.getElementById("password")
  const inputUploadFile = document.getElementById("uploadFile")
  const handleInputFile = document.getElementById("file")
  const uploadsFileList = document.getElementById("uploadedFiles")
  const msgBox = document.getElementById("msgBox")

  let files = []

  window.onload = fetchFiles

  handleFormUpload.addEventListener("submit", handleFormSubmit)

  handleInputFile.addEventListener("change", handleFileInputChange)

  async function handleFormSubmit(e) {
    e.preventDefault()

    const password = inputPassword.value.trim()
    const fileName = inputUploadFile.value.trim()

    if (!password || !fileName) {
      showMessage("Please provide password or file upload", "alert--danger")
      return
    }

    showMessage("", "")

    try {
      const fileData = await readFileAsDataURL(handleInputFile.files[0])
      const upload = getPayload(fileName, fileData)
      files.push(upload)
      renderUploadItems()
      await sendFile(upload)
      clearInputs()
    } catch (error) {
      showMessage("Error", "alert--danger")
    }
  }

  async function handleFileInputChange(e) {
    try {
      await readFileAsDataURL(e.target.files[0])
      const fsize = e.target.files[0].size
      const file = fsize / (1024 * 1024)
      const minFileSize = 0.1 
      const maxFileSize = 20 

      if (file < minFileSize || file > maxFileSize) {
        showMessage(
          "File size must be between 0.1MB and 20MB",
          "alert--danger"
        )
        return
      }

      showMessage("", "")
      inputUploadFile.value = e.target.files[0].name

    } catch (error) {
      showMessage(error, "alert--danger")
    }
  }

  function getPayload(name, fileData) {
    const id = Date.now()
    const date = getCurrentDate()
    return { id, date, name, fileData }
  }

  function showMessage(message, className) {
    msgBox.innerText = message
    msgBox.className = `alert ${className}`
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = () => {
        reject(fileReader.error)
      }
      fileReader.readAsDataURL(file)
    })
  }

  function getCurrentDate() {
    const currentDate = new Date()
    const day = String(currentDate.getDate()).padStart(2, "0")
    const month = String(currentDate.getMonth() + 1).padStart(2, "0")
    const year = currentDate.getFullYear()

    return `${day}/${month}/${year}`
  }

  async function sendFile(upload) {
    try {
      const res = await axios.post("http://localhost:3000/files", upload, {
        onUploadProgress: (progress) => {
          const percentage = Math.round(
            (progress.loaded / progress.total) * 100
          )
          const progressBar = document.getElementById(
            `progressBar-${upload.id}`
          )
          progressBar.style.width = `${percentage}%`
        },
      })


      if (res) {
        await fetchFiles()
        showMessage("File successfully uploaded", "alert--success")
      }
    } catch (error) {
      showMessage(error, "alert--danger")
    }
  }

  async function fetchFiles() {
    try {
      const response = await fetch("http://localhost:3000/files")
      const data = await response.json()
      files = data
      renderUploadItems()
    } catch (error) {
      showMessage(error, "alert--danger")
    }
  }

  function clearInputs() {
    inputPassword.value = ""
    inputUploadFile.value = ""
  }

  function renderUploadItems() {
    uploadsFileList.innerHTML = ""

    files.forEach((file) => {
      const uploadedFile = document.createElement("div")
      uploadedFile.classList.add("table-row", "uploads__item")
      uploadedFile.innerHTML = `
      <span class='row-item uploads__item-date'>${file.date}</span>
      <span class='row-item uploads__item-name'>${file.name}</span>
      <div class='row-item uploads__item-progress-bar progress__bar'>
        <div class='progress__bar-inner progress__bar-success' id='progressBar-${file.id}'></div>
      </div>`

      uploadsFileList.appendChild(uploadedFile)
    })
  }
}
