import {LitElement, html} from '@polymer/lit-element';

import '@polymer/iron-form';
import '@polymer/paper-card';
import '@polymer/paper-input/paper-input';
import '@material/mwc-button';
//import './login-icons.js';

/**
 * `usm-login`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class UsmLogin extends LitElement {
  
  constructor() {
    super();
    this._login =  { username: "", password: "" };
    this._formValid = false;
    this.token = "";
    this.varXml = "";
    this.sistemaKey = "";
  }

  static get properties() {
    return {
      /**
      * String con las etiquetas del XML encriptadas a enviar.
      * @type {String}
      */
      varXml: String,

      /**
      * El código del sistema entregado por la DTI.
      * @type {String}
      */
      sistemaKey: String,

      /**
      * String con el token devuelto por el sistema de login institucional.
      * @type {String}
      */
      token: String,

      /**
      * Objeto que contiene la información ingresada por el usuario (username y password) en el formulario de login.
      * @type {Object}
      * @private
      */
      _login: Object,

      /**
      *  Flag para manejar el estado del boton enviar del formulario de login.
      * @type {Boolean}
      * @private
      */
      _formValid: Boolean
    };
  }

  _render({_login, _formValid, varXml, sistemaKey})  {
    return html`
      <style>
      :host {
        --iron-icon-width: 35px;
        --iron-icon-height: 35px;
        display: flex;
        justify-content: center;
      }
      div.card-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    </style>

    
    <iron-form id="loginForm"
      on-iron-form-invalid="_formInvalid"
      on-iron-form-presubmit="_formPreSubmit"
      on-iron-form-response="_formResponse"
      on-iron-form-error="_formError"
    >
      <form id="formulario1" name="formulario1" method="post" action="https://ssonew.usm.cl/loginusm/login/login.xhtml?varE=${sistemaKey}&varXML=${varXml}" class="transparente pad5" enctype="application/x-www-form-urlencoded">
        
        <paper-card heading="Ingreso Cuenta USM">
          <div class="card-content">
            <input type="hidden" name="formulario1" value="formulario1" data-original-title="" title="">
            <paper-input 
              label="nombre.apellido" 
              name="formulario1:username" 
              value=${_login.username} 
              title="Ej.: juan.perez"
              required
              pattern="^[a-zA-Z]+\.[a-zA-Z]+$" 
              error-message="Formato Inválido"
              >
              <iron-icon icon="login-icons:perm-identity" slot="prefix"></iron-icon>
            </paper-input>
            
            <paper-input label="contraseña" name="formulario1:pass" value=${_login.password} required type="password">
              <iron-icon icon="login-icons:lock-outline" slot="prefix"></iron-icon>
            </paper-input>
          </div>

          <div class="card-actions">
            <mwc-button raised name="formulario1:j_idt10" disabled$="${!_formValid}" on-click="formSubmit">Enviar</mwc-button>
            <a href="https://pasaporte.usm.cl/id/" target="_parent" class="linkT">¿Olvidó su Contraseña?</a>
          </div>
        </paper-card>

        <div id="formulario1:messages" class="ui-messages ui-widget" aria-live="polite"></div>
      </form>
    </iron-form>
    `;
  }

  

  static get observers() {
    return [
      '_changedLogin(_login.username, _login.password)'
    ];
  }
  
  _changedLogin(username, password){
    console.log('changedLogin', this._login)
    if(username.length && password.length){
      this._formValid = this.$.loginForm.validate();
    }
  }

  _formInvalid(e) {
    console.log('FormInvalid', e);
    this._formValid=false;
  }

  _formPreSubmit(e) {
    console.log('FormPreSubmit', this.$.loginForm.request.body);
    this.$.loginForm.request.body['formulario1:varXML'] = this.varXml;
    this.$.loginForm.request.body['formulario1:sistemaKey'] = this.sistemaKey;
  }

  formSubmit() {
    console.log('formSubmit');
    this.$.loginForm.submit();
  }

  _formResponse(e) {
    console.log('response', e);
    this.token=e.detail;
    this.dispatchEvent(new CustomEvent('usm-login-response', {
      detail: e.detail,
      bubbles: true,
      composed: true
    }));
  }

  _formError(e) {
    console.log('form error', e);
    this.dispatchEvent(new CustomEvent('usm-login-error', {
      detail: e.error,
      bubbles: true,
      composed: true
    }));
  }

  logout() {
    this.token="";
  }

  /**
   * Evento desencadenado al ocurrir el login exitoso, que trae el token de autenticacion
   *  @event usm-login-response
   */
  
  /**
   * Evento desencadenado al ocurrir un error en el proceso de login, expone el o los errorres recibidos
   *  @event usm-login-error
   */
}

window.customElements.define('usm-login', UsmLogin);
