import config from '../../config';

function notify(props) {
    new window.PNotify({
            title: props.title,
            text: props.message,
            type: props.status,
            addclass: 'stack-topright',
            stack: config.stack_topright
        }
    )
}

export default notify;