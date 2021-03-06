
import React, {Component} from 'react';

class CreateRoom extends React.Component{

  constructor(){
    super()

    this.state = {
      errorMessage: "",
      displayError: false
    }
  }

  backToWelcome = () => {
    this.props.parentMethods.changeView("Welcome");
  }

  handleChange = event => {
    event.preventDefault();
    event.persist();

    console.log(event.target.speakerLanguage)
    //change App.jsx state.view to <Speaker/>
    //generate random room id
    //add room name, room id and speaker language to App.jsx state
    let msg = {
      type: 'create-room',
      content: {
        name: event.target.roomName.value,
        language: event.target.speakerLanguage.options[event.target.speakerLanguage.selectedIndex].value
      }
    }
    console.log(`Attempting to create room.`)
    this.props.parentStates.ws.send(JSON.stringify(msg));

    this.props.parentStates.ws.on('stream', this.handleStream);
  }

  handleStream = stream => {
      console.log("Receiving response stream")

      //HANDLE INCOMING DATA
      stream.on('data', data => {

        console.log("Receiving data")

        if(data && typeof(data) == 'string'){
          let msg = JSON.parse(data);
          if(msg.type === 'notification' && msg.content.text === 'success') {

            this.props.parentMethods.changeRoomID(msg.content.id);
            this.props.parentMethods.changeRoomName(msg.content.name);
            this.props.parentMethods.changeLanguage(msg.content.language);

            this.props.parentStates.ws.removeAllListeners('stream');

            this.props.parentMethods.changeView("Speaker");
          } else {
            let errorMsg = "Create room request denied - Please try again"
            this.setState({errorMessage: errorMsg, displayError: true})
            console.log(errorMsg);
          }
        } else {
          console.log("Expect response from server to be a stringified JSON")
        }
      });
  }

  render(){
    return(
      <div id='create-room'>
        {this.state.displayError &&
            (
              <div className='error-bar'>
                <p>{this.state.errorMessage}</p>
              </div>
            )
          }
        <div className="blurred-box">
          <h1>Create a room!</h1>
          <div className="user-info-box">
            <form onSubmit={this.handleChange} className="user-info-form">

              <input type="text" name="roomName" id='roomName' placeholder="Room Name"/>

              <select name="speakerLanguage" id="language-list">
                <option value="af-ZA">Afrikaans</option>
                <option value="am-ET">አማርኛ (ኢትዮጵያ)</option>
                <option value="hy-AM">Հայ (Հայաստան)</option>
                <option value="az-AZ">Azərbaycan</option>
                <option value="id-ID">Bahasa (Indonesia)</option>
                <option value="ms-MY">Bahasa (Melayu)</option>
                <option value="bn-BD">বাংলা (বাংলাদেশ)</option>
                <option value="bn-IN">বাংলা (ভারত)</option>
                <option value="ca-ES">Català (Espanya)</option>
                <option value="cs-CZ">Čeština (Česká republika)</option>
                <option value="da-DK">Dansk (Danmark)</option>
                <option value="de-DE">Deutsch (Deutschland)</option>
                <option value="en-AU">English (Australia)</option>
                <option value="en-CA">English (Canada)</option>
                <option value="en-GH">English (Ghana)</option>
                <option value="en-GB">English (Great Britain)</option>
                <option value="en-IN">English (India)</option>
                <option value="en-IE">English (Ireland)</option>
                <option value="en-KE">English (Kenya)</option>
                <option value="en-NZ">English (New Zealand)</option>
                <option value="en-NG">English (Nigeria)</option>
                <option value="en-PH">English (Philippines)</option>
                <option value="en-ZA">English (South Africa)</option>
                <option value="en-TZ">English (Tanzania)</option>
                <option value="en-US">English (United States)</option>
                <option value="es-AR">Español (Argentina)</option>
                <option value="es-BO">Español (Bolivia)</option>
                <option value="es-CL">Español (Chile)</option>
                <option value="es-CO">Español (Colombia)</option>
                <option value="es-CR">Español (Costa Rica)</option>
                <option value="es-EC">Español (Ecuador)</option>
                <option value="es-SV">Español (El Salvador)</option>
                <option value="es-ES">Español (España)</option>
                <option value="es-US">Español (Estados Unidos)</option>
                <option value="es-GT">Español (Guatemala)</option>
                <option value="es-HN">Español (Honduras)</option>
                <option value="es-MX">Español (México)</option>
                <option value="es-NI">Español (Nicaragua)</option>
                <option value="es-PA">Español (Panamá)</option>
                <option value="es-PY">Español (Paraguay)</option>
                <option value="es-PE">Español (Perú)</option>
                <option value="es-PR">Español (Puerto Rico)</option>
                <option value="es-DO">Español (República Dominicana)</option>
                <option value="es-UY">Español (Uruguay)</option>
                <option value="es-VE">Español (Venezuela)</option>
                <option value="eu-ES">Euskara (Espainia)</option>
                <option value="fil-PH">Filipino (Pilipinas)</option>
                <option value="fr-CA">Français (Canada)</option>
                <option value="fr-FR">Français (France)</option>
                <option value="gl-ES">Galego (España)</option>
                <option value="ka-GE">ქართული (საქართველო)</option>
                <option value="gu-IN">ગુજરાતી (ભારત)</option>
                <option value="hr-HR">Hrvatski (Hrvatska)</option>
                <option value="zu-ZA">IsiZulu (Ningizimu Afrika)</option>
                <option value="is-IS">Íslenska (Ísland)</option>
                <option value="it-IT">Italiano (Italia)</option>
                <option value="jv-ID">Jawa (Indonesia)</option>
                <option value="kn-IN">ಕನ್ನಡ (ಭಾರತ)</option>
                <option value="km-KH">ភាសាខ្មែរ (កម្ពុជា)</option>
                <option value="lo-LA">ລາວ (ລາວ)</option>
                <option value="lv-LV">Latviešu (latviešu)</option>
                <option value="lt-LT">Lietuvių (Lietuva)</option>
                <option value="hu-HU">Magyar (Magyarország)</option>
                <option value="ml-IN">മലയാളം (ഇന്ത്യ)</option>
                <option value="mr-IN">मराठी (भारत)</option>
                <option value="nl-NL">Nederlands (Nederland)</option>
                <option value="ne-NP">नेपाली (नेपाल)</option>
                <option value="nb-NO">Norsk bokmål (Norge)</option>
                <option value="pl-PL">Polski (Polska)</option>
                <option value="pt-BR">Português (Brasil)</option>
                <option value="pt-PT">Português (Portugal)</option>
                <option value="ro-RO">Română (România)</option>
                <option value="si-LK">සිංහල (ශ්රී ලංකාව)</option>
                <option value="sk-SK">Slovenčina (Slovensko)</option>
                <option value="sl-SI">Slovenščina (Slovenija)</option>
                <option value="su-ID">Urang (Indonesia)</option>
                <option value="sw-TZ">Swahili (Tanzania)</option>
                <option value="sw-KE">Swahili (Kenya)</option>
                <option value="fi-FI">Suomi (Suomi)</option>
                <option value="sv-SE">Svenska (Sverige)</option>
                <option value="ta-IN">தமிழ் (இந்தியா)</option>
                <option value="ta-SG">தமிழ் (சிங்கப்பூர்)</option>
                <option value="ta-LK">தமிழ் (இலங்கை)</option>
                <option value="ta-MY">தமிழ் (மலேசியா)</option>
                <option value="te-IN">తెలుగు (భారతదేశం)</option>
                <option value="vi-VN">Tiếng Việt (Việt Nam)</option>
                <option value="tr-TR">Türkçe (Türkiye)</option>
                <option value="ur-PK">اردو (پاکستان)</option>
                <option value="ur-IN">اردو (بھارت)</option>
                <option value="el-GR">Ελληνικά (Ελλάδα)</option>
                <option value="bg-BG">Български (България)</option>
                <option value="ru-RU">Русский (Россия)</option>
                <option value="sr-RS">Српски (Србија)</option>
                <option value="uk-UA">Українська (Україна)</option>
                <option value="he-IL">עברית (ישראל)</option>
                <option value="ar-IL">العربية (إسرائيل)</option>
                <option value="ar-JO">العربية (الأردن)</option>
                <option value="ar-AE">العربية (الإمارات)</option>
                <option value="ar-BH">العربية (البحرين)</option>
                <option value="ar-DZ">العربية (الجزائر)</option>
                <option value="ar-SA">العربية (السعودية)</option>
                <option value="ar-IQ">العربية (العراق)</option>
                <option value="ar-KW">العربية (الكويت)</option>
                <option value="ar-MA">العربية (المغرب)</option>
                <option value="ar-TN">العربية (تونس)</option>
                <option value="ar-OM">العربية (عُمان)</option>
                <option value="ar-PS">العربية (فلسطين)</option>
                <option value="ar-QA">العربية (قطر)</option>
                <option value="ar-LB">العربية (لبنان)</option>
                <option value="ar-EG">العربية (مصر)</option>
                <option value="fa-IR">فارسی (ایران)</option>
                <option value="hi-IN">हिन्दी (भारत)</option>
                <option value="th-TH">ไทย (ประเทศไทย)</option>
                <option value="ko-KR">한국어 (대한민국)</option>
                <option value="cmn-Hant-TW">國語 (台灣)</option>
                <option value="yue-Hant-HK">廣東話 (香港)</option>
                <option value="ja-JP">日本語（日本)</option>
                <option value="cmn-Hans-HK">普通話 (香港)</option>
                <option value="cmn-Hans-CN">普通话 (中国大陆)</option>

              </select>

              <input type="submit" value="Submit"/>

              <button onClick= {this.backToWelcome} id="go-back-button">Back</button>

            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default CreateRoom;