const socket = io()

//Elements ($ is used as a convention to use DOM elements)
const $messageForm = document.getElementById('message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.getElementById('send-location')
const $messages = document.getElementById('messages')
const $sidebarList = document.getElementById('sidebar')

//Templates
const messageTemplate = document.getElementById('message-template').innerHTML
const locationTemplate = document.getElementById('location-template').innerHTML
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML

//Options
const { username, room, password} = Qs.parse(location.search, { ignoreQueryPrefix: true })

//Message Autoscroll function
const autoScroll = () => {
    $messages.scrollTop = $messages.scrollHeight
    //New Message element
    // const $newMessage = $messages.lastElementChild
    
    // //Height of the new messge
    // const newMessageStyles = getComputedStyle($newMessage)
    // const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    // const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // //Visible Height
    // const visibleHeight = $messages.offsetHeight

    // //Height of messages container
    // const containerHeight = $messages.scrollHeight

    // //How far have I scrolled
    // const scrollOffset = $messages.scrollTop + visibleHeight

    // if(containerHeight - newMessageHeight <= scrollOffset) {
    //     $messages.scrollTop = $messages.scrollHeight
    // }
}

socket.emit('join', { username, room, password }, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    $sidebarList.innerHTML = html
})

socket.on('message', ({ username, text, createdAt }) => {
    const html = Mustache.render(messageTemplate, {
        username,
        text,
        createdAt
    })

    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('locationMessage', ({ username, url, createdAt }) => {
    const html = Mustache.render(locationTemplate, {
        username,
        url,
        createdAt
    })

    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if($messageFormInput.value) {
        $messageFormButton.setAttribute('disabled', 'disabled')

        const message = e.target.elements.message.value

        socket.emit('sendMessage', message, (acknowlegement) => {
            console.log(acknowlegement)
            $messageFormButton.removeAttribute('disabled')
            $messageFormInput.value = ''
            $messageFormInput.focus()
    })
    }
})

$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Your Browser does not support Geolocation')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (acknowlegement) => {
            console.log(acknowlegement)
            setTimeout(() => {
                $sendLocationButton.removeAttribute('disabled')
            }, 2000)
        })
    })
})