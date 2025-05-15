$(document).ready(function () {
    let current = 1;
    function showPage(n) {
        $('.story-page').removeClass('active');
        $('#page' + n).addClass('active');
        $('#prevStory').prop('disabled', n === 1);
    }
    showPage(1);
    $('#prevStory').click(() => { if (current > 1) showPage(--current); });
    $('#nextStory').click(() => { if (current < 3) showPage(++current); });
    $('#prevStory2').click(() => showPage(1));
    $('#nextStory2').click(() => showPage(3));
    $('#prevStory3').click(() => showPage(2));
    $('#startGame').click(() => {
        $('#storyContainer').hide();
        $('.section, #timer').show();
    });
});