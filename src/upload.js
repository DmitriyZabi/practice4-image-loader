function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes == 0) {
    return '0 Byte'
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

const element = (tag, classes = [], content) => {
  const node = document.createElement(tag)
  if (classes.length) {
    node.classList.add(...classes)
  }
  if (content) {
    node.textContent = content
  }
  return node
}

const noop = function () {}

export function upload(selector, options = {}) {
  let files = []
  const onUpload = options.onUpload ?? noop
  const input = document.querySelector(selector)
  const btnOpen = element('button', ['btn'], 'Открыть')
  const btnUpload = element('button', ['btn', 'primary'], 'Загрузить')
  btnUpload.style.display = 'none'
  const preview = element('div', ['preview'])
  preview.classList.add('preview')

  if (options.multi) {
    input.setAttribute('multiple', true)
  }

  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute('accept', options.accept.join(','))
  }

  input.insertAdjacentElement('afterend', preview)
  input.insertAdjacentElement('afterend', btnUpload)
  input.insertAdjacentElement('afterend', btnOpen)

  const triggerInput = () => input.click()
  const changeHandler = (event) => {
    if (!event.target.files.length) {
      return
    }
    files = Array.from(event.target.files)
    preview.innerHTML = ''
    btnUpload.style.display = 'inline'
    files.forEach((file) => {
      if (!file.type.match('image')) {
        return
      }

      const reader = new FileReader()

      reader.onload = (event) => {
        preview.insertAdjacentHTML(
          'afterbegin',
          `
            <div class="preview-image">
                <div class="preview-remove" data-name="${
                  file.name
                }">&times;</div>
                <img src ="${event.target.result}" alt="${file.name}" />
                <div class="preview-info">
                    <span>${file.name}</span>
                    <span>${bytesToSize(file.size)}</span>
                </div>
            </div>
        `
        )
      }

      reader.readAsDataURL(file)
    })
  }

  const removeHandler = (event) => {
    if (!event.target.dataset.name) {
      return
    }
    const { name } = event.target.dataset
    files = files.filter((file) => file.name != name)
    if (!files.length) {
      btnUpload.style.display = 'none'
    }
    const block = preview
      .querySelector(`[data-name="${name}"]`)
      .closest('.preview-image')
    block.classList.add('removing')
    setTimeout(() => {
      block.remove()
    }, 300)
  }

  const clearPreview = (el) => {
    el.style.bottom = '3px'
    el.innerHTML = `<div class="preview-info-progress"></div>`
  }

  const uploadHandler = () => {
    preview.querySelectorAll('.preview-remove').forEach((e) => e.remove())
    const previewInfo = preview.querySelectorAll('.preview-info')
    previewInfo.forEach(clearPreview)
    console.log(previewInfo)
    onUpload(files, previewInfo)
  }

  btnOpen.addEventListener('click', triggerInput)
  btnUpload.addEventListener('click', uploadHandler)
  input.addEventListener('change', changeHandler)
  preview.addEventListener('click', removeHandler)
}
