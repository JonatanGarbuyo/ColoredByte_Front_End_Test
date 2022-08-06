const initialState = {
  user: {
    city: 'Buenos Aires',
    country: 'Argentina',
    imageUrl: 'https://avatars.githubusercontent.com/u/58077441',
    name: 'Jonatan Garbuyo',
  },
  post: {
    like: false,
    id: 33,
    imagesUrl: 'https://picsum.photos/v2/list?page=22&limit=3',
    description: {
      text: 'dolor sit amet, consectetur adipiscing elit. Mi enim ut eu cras ultrices eget et tristique proin. Mi enim ut eu cras ultrices eget et tristique proin.',
      author: 'Lucas Credie',
    },
    comments: [
      {
        id: 1,
        text: 'consectetur adipiscing elit. Mi enim ut eu cras ultrices eget et',
        author: {
          name: '',
        },
      },
    ],
  },
}

// Initial render
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('comment-form')
  const likeButton = document.getElementById('heart-button')

  form.addEventListener('submit', handleSubmit)
  likeButton.addEventListener('click', handleLike)

  let state = getStateFromStorage()
  if (!state) {
    state = initialState
    setStateinStorage(state)
  }
  renderPage(state)
})

// Handler functions
function handleSubmit(e) {
  e.preventDefault()
  const form = this
  let data = new FormData(form)

  isValidPost(data) && pushCommentToPostList(data)
  form.reset()
}

function handleLike() {
  const { user, post } = getStateFromStorage()
  const heartIcon = this.firstElementChild

  const newState = {
    user,
    post: { ...post, like: !post.like },
  }

  heartIcon.classList.toggle('likedAnimation', newState.post.like)
  heartIcon.classList.toggle('liked')
  setStateinStorage(newState)
}

// Helper functions
async function renderPage(state) {
  const { user, post } = state

  renderUserInfo(user)
  renderImages(post)
  renderDescription(post)
  // Render comments
  post.comments.forEach((comment) => {
    renderComment(comment)
  })
}

function renderUserInfo(userData) {
  const avatar = document.getElementById('avatar-image')
  const userName = document.getElementById('user-name')
  const userLocation = document.getElementById('user-location')

  avatar.src = userData.imageUrl
  userName.innerText = userData.name
  userLocation.innerText = `${userData.city}, ${userData.country}`
}

async function renderImages(post) {
  const images = await fetchImages(post.imagesUrl)

  images.forEach((image) => {
    const swiperSlide = document.createElement('img')

    swiperSlide.className = 'swiper-slide'
    swiperSlide.src = image.download_url

    document.getElementById('swiper-wrapper').appendChild(swiperSlide)
  })
  renderSwiper()
}

function renderSwiper() {
  new Swiper('.swiper', {
    slidesPerView: 1,
    slidesPerGroup: 1,
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  })
}

function renderDescription(postData) {
  const heartIcon = document.getElementById('heart-icon')
  const author = document.createElement('strong')
  const descriptionText = document.createElement('span')

  author.innerText = `${postData.description.author} `
  descriptionText.innerText = postData.description.text
  document.getElementById('description').append(author, descriptionText)

  postData.like && heartIcon.classList.toggle('liked')
}

function renderComment(comment) {
  const commentElement = document.createElement('p')
  const commentTitle = document.createElement('strong')
  const commentText = document.createElement('span')

  commentTitle.innerText = 'Comment '
  commentText.innerText = comment.text

  commentElement.append(commentTitle, commentText)
  document.getElementById('comments').append(commentElement)
}

function pushCommentToPostList(post) {
  const text = post.get('text')
  const newPost = {
    id: Date.now(),
    text: text,
    author: {
      name: '',
    },
  }

  const state = getStateFromStorage()
  state.post.comments.push(newPost)

  setStateinStorage(state)
  renderComment(newPost)
}

function isValidPost(post) {
  const text = post.get('text')
  if (text.length < 1) {
    return false
  } else {
    return true
  }
}

function setStateinStorage(state) {
  const newState = JSON.stringify(state)
  localStorage.setItem('coloredByte', newState)
}

function getStateFromStorage() {
  return JSON.parse(localStorage.getItem('coloredByte'))
}

async function fetchImages(imagesUrl) {
  try {
    const response = await fetch(imagesUrl)
    return response.json()
  } catch (error) {
    console.log(error.message)
  }
}
