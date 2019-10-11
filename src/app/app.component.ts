import { Component,Inject } from '@angular/core';
import { Client } from '@xmpp/client-core';
import { jid } from '@xmpp/jid';
import {
    ChatService,
    ChatServiceToken,
    MultiUserChatPlugin,
    RegistrationPlugin,
    XmppClientToken,
} from './ngx-chat-imports';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MyNgxChat';

  public domain: string;
  public uri: string;
  public password: string;
  public jid: string;
  public contactJID: string;
  public registrationMessage: string;
  public multiUserChatPlugin: MultiUserChatPlugin;

  constructor(@Inject(ChatServiceToken) public chatService: ChatService,
              @Inject(XmppClientToken) public client: Client){
        const contactData: any = JSON.parse(localStorage.getItem('data')) || {};
        this.domain = contactData.domain;
        this.uri = contactData.uri;
        this.password = contactData.password;
        this.jid = contactData.jid;
        this.multiUserChatPlugin = this.chatService.getPlugin(MultiUserChatPlugin);

        // @ts-ignore
        window.chatService = chatService;
    }

    onLogin() {
      const logInRequest = {
          domain: this.domain,
          uri: this.uri,
          password: this.password,
          jid: this.jid,
      };
      localStorage.setItem('data', JSON.stringify(logInRequest));
      this.chatService.logIn(logInRequest);
    }

    onLogout() {
      this.chatService.logOut();
    }

    onReconnect() {
      this.chatService.reconnect();
    }

    async onRegister() {
      this.registrationMessage = 'registering ...';
      try {
          await this.chatService.getPlugin(RegistrationPlugin).register(
              jid(this.jid).local,
              this.password,
              this.uri,
              this.domain
          );
          this.registrationMessage = 'registration successful';
      } catch (e) {
          this.registrationMessage = 'registration failed: ' + e.toString();
          throw e;
      }
    }

    onAddContact(){
      this.chatService.addContact(this.contactJID);
    }
}
