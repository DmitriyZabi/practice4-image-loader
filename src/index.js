import '@/styles/styles.css'
import '@/styles/scss.scss'
import { upload } from '@/upload.js'
//import firebase from 'firebase/app'
//import 'firebase/storage'
/*import firebase from 'firebase/compat/app'
import { getStorage } from 'firebase/storage'*/

import { initializeApp } from 'firebase/app'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDTUCmEjf-euTSderQb64sps8WHbbU_1ao',
  authDomain: 'upload-images-js.firebaseapp.com',
  projectId: 'upload-images-js',
  storageBucket: 'upload-images-js.appspot.com',
  messagingSenderId: '500566832025',
  appId: '1:500566832025:web:40dd54bae96136acb41908',
}
const firebaseApp = initializeApp(firebaseConfig)
const storage = getStorage(firebaseApp)

upload('#file', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg'],
  onUpload(files, blocks) {
    //console.log(blocks)
    files.forEach((file, index) => {
      const storageRef = ref(storage, `images/${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (
            (snapshot.bytesTransferred / snapshot.totalBytes) *
            100
          ).toFixed(0)
          const block = blocks[index].querySelector('.preview-info-progress')
          block.textContent = `${progress}%`
          block.style.width = `${progress}%`
          /*
          console.log('Upload is ' + progress + '% done')
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
          }
          */
        },
        (error) => {
          console.log(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL)
          })
          console.log('Completed')
        }
      )
    })
  },
})
