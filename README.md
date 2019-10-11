**How to create a simple chat application using XMPP and NgxChat**

Before going directly to the creation of the project, let's define some key concepts that will guide us through this tutorial :

XMPP, originally named Jabber, stands for  Extensible Messaging and Presence Protocol. It is a communication protocol for message-oriented middleware based on XML (Extensible Markup Language). It enables the near-real-time exchange of structured yet extensible data between any two or more network entities.

NgxChat is an [Angular](https://github.com/angular/angular)-based  library that provide an out-of-the-box usable XMPP chat component. It is customizable and offers an API to integrate it with your application.

After this development, it is time to move on to the creation of the project.

**1.** **Installations and usage**

At this point, npm must already be installed. For those who do not know what npm is and how to install it, [this link](https://nodejs.org/en/) will be extremely useful for them.

First of all, you need to install Angular (CLI) via npm CLI :

    npm install -g @angular/cli

Then you can create a new project via `ng`, the Angular CLI :

    ng new my-ngx-chat

Once the project is created, it should look like this

![](doc/screenshots/capture12.jpg)

And if everything went well, you can already run your application with the command.

    ng serve –open

![](doc/screenshots/capture13.JPG)

Here is how your application should look like once run.

After that, you can now install XMPP and NgxChat, and add them to your project. Always from the root of your project, type the command below

    npm install --save @pazznetwork/ngx-chat @xmpp/client@~0.3.0 @angular/cdk@~8.0.0

Some folders will be downloaded and added to the "node_modules" folder which contains all the dependencies for your application including Angular, TypeScript, XMPP and NgxChat source files.

![](doc/screenshots/capture15.JPG)
![](doc/screenshots/capture16.JPG)

**2.** **Implementation**

Now that all the tools are installed, we can move on to the implementation of our application. Here below is the structure (src folder) of our project, and only the index.html file and the app folder are of interest in this tutorial.

![](doc/screenshots/capture18.JPG)

The `index.html` file looks like this by default, and should remains so.

    <!doctype  html>
    <html  lang="en">
    <head>
	    <meta  charset="utf-8">
	    <title>MyNgxChat</title>
	    <base  href="/">
	    <meta  name="viewport"  content="width=device-width, initial-scale=1">
	    <link  rel="icon"  type="image/x-icon"  href="favicon.ico">
    </head>
    <body>
	    <app-root></app-root>   
    </body>
    </html>

You can however add a css library, like Materialize CSS, to create quite presentable GUI.

A basic chat application must still offer the possibility for a user to log in before exchanging messages with another one. We can then modify the `src/app/app.component.html` file and replace the code inside by this one

    <div  class="container">
	    <div  class="row col s6">
		<div>
		    XMPP domain
		    <small>(e.g. jabber.example.com)</small>
		</div>
		<div>
			<input  name="domain"  [(ngModel)]="domain"  class="form-control col s12"  type="text"  placeholder="jabber.example.com"/>
		</div>
	    </div>
	    <div  class="row col s6">
		<div>    
		    Host Websocket endpoint
		    <small>(e.g. wss://jabber.example.com:5280/websocket)</small>
		</div>
		<div>   
		    <input  name="uri"  [(ngModel)]="uri"  class="form-control"  type="text"  placeholder="wss://jabber.example.com:5280/websocket"/>
		</div>
	    </div>
	    <div  class="row col s6">
            <div>
                JID
                <small>(e.g. test@jabber.example.com)</small>
            </div>
            <div>
                <input  name="jid"  [(ngModel)]="jid"  class="form-control"  type="text"  placeholder="test@jabber.example.com">
            </div>
	    </div>
	    <div  class="row col s6">
            <div>
                Password
            </div>
            <div>
                <input  name="password"  [(ngModel)]="password"  class="form-control"  type="password"  placeholder="Password"/>
            </div>
	    </div>
	    <div>
            <button  name="login"  class="btn"  (click)="onLogin()">Log in</button>
            <button  name="logout"  class="btn"  (click)="onLogout()">Log out</button>
            <button  name="register"  class="btn"  (click)="onRegister()">Register</button>
            <button  name="reconnect"  class="btn"  (click)="onReconnect()">Reconnect</button>
	    </div>
	    <div>State: {{chatService.state$ | async}} (internal state: {{client.status}})</div>
	    <div  *ngIf="registrationMessage">
		    <p>{{registrationMessage}}</p>
	    </div>
	    <div  class="form-group">
            <div>
                <input  name="contactJID"  [(ngModel)]="contactJID"  class="form-control"  type="text"  placeholder="User JID"/>
            </div>
            <div>
                <button  (click)="onAddContact()"  class="btn">Add a contact</button>
            </div>
	    </div>
    </div>    
    <ngx-chat  rosterState="shown"></ngx-chat>

It is a simple form where I added some Materialize classes, and il looks like this :

    ![](doc/screenshots/capture19.JPG)
To test your chat application locally, you must install and implement your own server based on the XMPP protocol. You can use [Openfire](https://www.igniterealtime.org/downloads/index.jsp) which is an instant messaging and groupchat server using XMPP to exchange messages. The Openfire server configuration is not covered in this topic.

As you may have noticed, there is a “ngx-chat” component at the end of this root component template. It will help you to use Ngx components and services. To do this,  you will have to modify the app.module.ts and app.component.ts files in the src/app folder.

Let’s check first the `app.module.ts` file default content

    import { BrowserModule } from  '@angular/platform-browser';
    import { NgModule } from  '@angular/core';
    import { AppComponent } from  './app.component';
    
    @NgModule({
	    declarations: [
		    AppComponent
	    ],
	    imports: [
		    BrowserModule
	    ],
	    providers: [],
	    bootstrap: [AppComponent]
    })
    
    export  class  AppModule { }

You need now to make some importations to add modules to the root component :

    import { BrowserModule, Inject } from  '@angular/platform-browser';
    import { NgModule } from  '@angular/core';
    import { FormsModule } from  '@angular/forms';
    import { NgxChatModule } from  '@pazznetwork/ngx-chat';
    import { AppComponent } from  './app.component';
    import { BrowserAnimationsModule } from  '@angular/platform-browser/animations';
    
    @NgModule({
	    declarations: [
		    AppComponent
	    ],
	    imports: [
    		BrowserModule,
		    FormsModule,
		    NgxChatModule.forRoot(),
		    BrowserAnimationsModule
	    ],
	    providers: [],
	    bootstrap: [AppComponent]
    })
    
    export  class  AppModule { }

  
We will not explain each line of code. It is not covered in this tutorial. We only show you how to create a basic chat application.

Once Ngx modules added, we can now import XMPP modules in the `app.component.ts` which by default looks like this

    import { Component } from  '@angular/core';
    
    @Component({
	    selector:  'app-root',
	    templateUrl:  './app.component.html',
	    styleUrls: ['./app.component.css']
    })
    
    export  class  AppComponent {    
	    title = 'my-ngx-chat';
    }

To add XMPP modules, make theses importations in the  `app.component.ts` file

    import { Client } from  '@xmpp/client-core';
    import { jid } from  '@xmpp/jid';
    
    import {
	    ChatService,
	    ChatServiceToken,
	    MultiUserChatPlugin,
	    RegistrationPlugin,
	    XmppClientToken,
    } from  '@pazznetwork/ngx-chat-imports';

At this stage, you can now implements methods (onLogin, onLogout, onAddContact) called from the authentication form in the `AppComponent` class; but you will need to add some useful properties and to create a constructor before.

    public  domain: string;
    public  uri: string;
    public  password: string;
    public  jid: string;
    public  contactJID: string;
    public  registrationMessage: string;
    
    constructor(@Inject(ChatServiceToken) public  chatService: ChatService,
		        @Inject(XmppClientToken) public  client: Client){
		const  contactData: any = JSON.parse(localStorage.getItem('data')) || {};   
		this.domain = contactData.domain;
		this.uri = contactData.uri;
		this.password = contactData.password;
		this.jid = contactData.jid;
		
		// @ts-ignore
		window.chatService = chatService;
    }

The methods to be implemented are as simple as possible. It's up to you how to customize them to meet your needs.

    onLogin() {
	    const  logInRequest = {
            domain:  this.domain,
            uri:  this.uri,
            password:  this.password,
            jid:  this.jid
	    };
	    localStorage.setItem('data', JSON.stringify(logInRequest));
	    this.chatService.logIn(logInRequest);
    }

    onLogout() {
	    this.chatService.logOut();
    }

    onAddContact(){
	    this.chatService.addContact(this.contactJID);
    }

Finally, you can run your chat application and exchange messages. To do it locally, you will need to use your Openfire server settings : XMPP domain (your laptop’s hostname) and Host Websocket endpoint  (ws://localhost:7070/ws or wss://localhost:7443/ws ). As JID (Jabber ID) your can use your server admin (which is an XMPP user by default) account credentials.

![](doc/screenshots/capture20.JPG)

After authentication, it should looks like this :

![](doc/screenshots/capture21.JPG)

You can then select a contact to exchange messages with. To be sure that everything’s working, you can create an other XMPP user from Openfire add and him here as a contact. Install the ”InVerse” plugin on your Openfire  server. Then open http://localhost:7070/inverse/ in another browser tab and log into with another XMPP user.

![](doc/screenshots/capture21.JPG)
![](doc/screenshots/capture11.JPG)





