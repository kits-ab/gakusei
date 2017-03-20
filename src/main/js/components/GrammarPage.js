import React from 'react';
import grammarPage from '../../resources/static/html/grammar.template.html';

/*
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Grammatik</title>
</head>
<body>
<script>
    function say(text) {
        var msg = new SpeechSynthesisUtterance();
        msg.text = text;
        msg.lang = 'ja-JP';
        speechSynthesis.speak(msg);
    }
</script>*/

const GrammarPage = () => grammarPage;

export default GrammarPage;
