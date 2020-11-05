window.addEventListener('load',()=>{

    // storing data to localstorage
    let btn = document.getElementById('new-todo')
    btn.addEventListener('click', ()=>{

        let formBtn = document.querySelector('.full_todo_section')
        formBtn.classList.remove('d-none')
        formBtn.classList.add('d-block')
        
        let header = document.querySelector('header')
        let upperSection = document.querySelector('.body')
        header.classList.add('d-none')
        upperSection.classList.add('d-none')

        btn.classList.add('d-none')

        // history api
        history.pushState(null, null, window.location.pathname)

    })


    // back button
    let backButton = document.getElementById('backButton')
    backButton.addEventListener('click', backButtonFunction)

    window.addEventListener('popstate', e => {
        e.preventDefault()
        backButtonFunction()
    })

    function backButtonFunction(){

        let formBtn = document.querySelector('.full_todo_section')
        formBtn.classList.remove('d-block')
        formBtn.classList.add('d-none')
        
        let header = document.querySelector('header')
        let upperSection = document.querySelector('.body')

        header.classList.remove('d-none')
        upperSection.classList.remove('d-none')
        btn.classList.remove('d-none')
        
    }




    })
