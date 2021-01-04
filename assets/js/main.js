let numberStep = 0
let numberVariable = '';
let listVote = document.getElementById('box-vote')
let infoCandidate = document.querySelector('.info-candidate')
let display = document.querySelector('.display')

function start(varCreateKeyboard = true){
    let stepCurrent = steps[numberStep]
    numberVariable = ''
    let numberQuantity = stepCurrent.quantity;
    let elTitle = document.querySelector('.container-display strong')
    elTitle.innerHTML = stepCurrent.name
    display.classList.remove('ok')
    createPast(stepCurrent)

    createVoteList(numberQuantity)
    if(varCreateKeyboard){
        createKeyboard()
    }
}

function createVoteList(numberQuantity, complete = false){
    //Vote list
    listVote.innerHTML = '';
    for (let i=0;i < numberQuantity; i++){
        let n = ''
        let number = numberVariable.toString().slice()
        if(complete){
            n = number[i]
        }
        listVote.innerHTML = listVote.innerHTML+'<li>'+n+'</li>'
    }
    if(!complete){
        listVote.firstElementChild.classList.add('selected')
    }
}

function createKeyboard(){
    //keyboard
    let listNumbers = document.getElementById('keyboard')
    for (let i=1;i < 10; i++){
        listNumbers.innerHTML = listNumbers.innerHTML+'<li><a onclick="changeNumber('+i+')" href="javascript:void(0);">'+i+'</a></li>'
    }
    listNumbers.innerHTML = listNumbers.innerHTML+'<li><a onclick="changeNumber(0)" href="javascript:void(0);">0</a></li>'
}

function changeNumber(n){
    let elementSelected = listVote.querySelector('.selected')
    if(elementSelected){
        if(numberVariable === 'white' || numberVariable === 'null'){
            numberVariable = ''
            display.classList.remove('ok')
        }
        numberVariable += n
        elementSelected.innerHTML = n
        elementSelected.removeAttribute('class')

        let nextSelected = elementSelected.nextElementSibling
        if(nextSelected){
            nextSelected.classList.add('selected')
        }else{
            display.classList.add('ok')
        }

        let stepCurrent = steps[numberStep]
        if(stepCurrent.quantity !== numberVariable.length){
            return false
        }
        searchCandidate(stepCurrent)
    }
}

function searchCandidate(stepCurrent){
    let candidate = stepCurrent.candidates.filter((item) =>{
        if(item.number === numberVariable.toString()){
            return true
        }else{
            return false
        }
    })
    if(candidate.length > 0){
        let complement = ''
        if(candidate[0].vice){
            complement = 'Vice: '+candidate[0].vice
        }
        infoCandidate.innerHTML = `<p>
                                Nome: ${candidate[0].name}<br>
                                Partido: ${candidate[0].part}<br>
                                ${complement}
                                </p>`
    }else{
        numberVariable = 'null'
        infoCandidate.innerHTML = `<p>Voto nulo</p>`
    }
}
function getCandidate(stepCurrent){
    let candidate = stepCurrent.candidates.filter((item) =>{
        if(item.number === numberVariable.toString()){
            return true
        }else{
            return false
        }
    })
    return candidate
}

function btnWhite(){
    start(false)
    display.classList.add('ok')
    numberVariable = 'white'
    infoCandidate.innerHTML = `<p>Voto em branco</p>`
}
function btnReset(){
    start(false)
    numberVariable = ''
    display.classList.remove('ok')
}
function btnConfirm(){
    //save info
    if(numberVariable.length === 0){
        return false
    }
    switch (numberVariable){
        case "white": steps[numberStep].votedWhite = true
            break
        case "null": steps[numberStep].votedNull = true
            break
        default :
            let candidate = getCandidate(steps[numberStep])
            steps[numberStep].candidate_id = candidate[0].id
    }
    numberStep++
    if(steps[numberStep]){
        start(false)
    }else{
        display.classList.remove('ok')
        display.classList.add('success')
        display.innerHTML = '<p>FIM</p>'
        document.getElementById('list-candidates').style.display = 'none'
        createResume(steps)
        setTimeout(function (){
            //save in database and reload'
            if(confirm('votar novamente?')){
                location.reload()
            }
        }, 5000)

    }
}

function fastVote(n){
    numberVariable = n
    let stepCurrent = steps[numberStep]
    createVoteList(stepCurrent.quantity, true)
    display.classList.add('ok')

    searchCandidate(stepCurrent)
}

function createPast(stepCurrent){
    let elementPast = document.getElementById('list-candidates')
    elementPast.innerHTML = `<span>Candidatos para: ${stepCurrent.name}</span>`
    for(let i=0;i < stepCurrent.candidates.length;i++){
        let complement = ''
        if(stepCurrent.candidates[0].vice){
            complement = '<p>Vice: '+stepCurrent.candidates[0].vice+'</p>'
        }
        elementPast.innerHTML = `
                                ${elementPast.innerHTML}
                                <div class="item">
                                    <p>
                                    Nome: ${stepCurrent.candidates[i].name}
                                    </p>
                                    <p>
                                    Número: ${stepCurrent.candidates[i].number}
                                    </p>
                                    ${complement}
                                    <p>
                                        <a href="javascript:void(0);" onclick="fastVote('${stepCurrent.candidates[i].number.toString()}')">Votar neste candidato</a>
                                    </p>
                                </div>`
    }
}

function createResume(steps){
    let elResumeVotes = document.getElementById('resume-votes')
    elResumeVotes.style.display = 'flex'
    elResumeVotes.innerHTML = `<span>Resumo dos seus votos</span>`
    for (let i = 0;i < steps.length; i++){
        let content = ''
        if(steps[i].votedWhite){
            content = 'Voto em branco'
        }
        if(steps[i].votedNull){
            content = 'Voto nulo'
        }
        if(steps[i].candidate_id){
            let candidate = steps[i].candidates.filter((item) =>{
                if(item.id === steps[i].candidate_id){
                    return true
                }else{
                    return false
                }
            })
            let complement = ''
            if(candidate[0].vice){
                complement = 'Vice: '+candidate[0].vice
            }
            content = `
                        Nome: ${candidate[0].name}<br />
                        Número: ${candidate[0].number}<br />
                        ${complement}`
        }

        elResumeVotes.innerHTML = elResumeVotes.innerHTML+`
                                    <div class="item">
                                        <strong>${steps[i].name}</strong>
                                        <p>${content}</p>
                                    </div>`
    }
}





