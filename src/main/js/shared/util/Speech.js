export default class Speech {
  static say(text) {
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.lang = 'ja-JP';
    window.speechSynthesis.speak(msg);
  }
}
