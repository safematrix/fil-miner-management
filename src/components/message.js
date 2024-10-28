
export default function Message(title, dalay = 3500)  {
    let messageDiv = document.createElement('div');

    messageDiv.className = 'message';
    messageDiv.classList.add('message-text');
    messageDiv.style.top = '-50px';
    messageDiv.style.animationDuration = '0.5s';
    messageDiv.append(title);
    document.body.append(messageDiv);

    setTimeout(() => {
        messageDiv.style.top = '20px';
        messageDiv.style.animationName = 'messageDisplayEnd';
        messageDiv.style.animationDuration = '0.2s';

        messageDiv.addEventListener('animationend', function handler() {
            messageDiv.removeEventListener('animationend', handler);
            messageDiv.parentNode.removeChild(messageDiv);
        })
    }, dalay);
}