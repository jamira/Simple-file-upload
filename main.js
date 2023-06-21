import './style.css'
import { setupFileUploader } from './upload.js'

document.querySelector('#app').innerHTML = `
  <main>
    <section class='panel'>
      <div class='panel__form-left'>
        <h1 class='panel__title'>File Upload</h1>
        <div id="msgBox" class='alert'></div>
        <form id='handleFormUpload' class='form' method='post' enctype='multipart/form-data'>
          <div class='form__field'>
            <label for='password' class='form__field-label'>Enter Password to Encrypt Files</label>
            <input type='password' id='password' name='password' class='form__field-input'>
          </div>
          <div class='form__field'>
            <label for='uploadFile' class='form__field-label'>Upload File</label>
            <input type='text' id='uploadFile' name='uploadFile' class='form__field-input' readonly>
          </div>
          <div class='form__field-actions'>
            <label for='file' class='form__field-upload'>Browse<input type='file' id='file' name='file'></label>
            <input type='submit' value='Upload' class='form__field-submit'>
          </div>
        </form>
      </div>
      <div class='panel__uploads-right'>
        <h2 class='panel__title'>Progress</h2>
        <div class='table-row heading'>
          <span class='row-item'>Date</span>
          <span class='row-item'>Name</span>
          <span class='row-item'>Progress</span>
        </div>
        <div class='uploads' id='uploadedFiles'>
        </div>
      </div>
    </section>
  </main>
`

setupFileUploader()
