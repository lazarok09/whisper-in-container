

<h1 align="center">Whisper in container 💫</h1>

<p align="center">
  <a href="#about">About</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#techs">Techs</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#execution">Execution</a>
</p>
<br/>

<div align="center"><img height=250 width=250 src="https://i.pinimg.com/originals/87/2a/57/872a57987284eb49af534b1cccb4ace3.gif" alt="animated gif" /></div>

<hr/>

<br/>

<h2 id="about">About</h2>
In order to get my postgraduate degree i choosed a funny thing to do, get in a container a entire machine learning model. My final goal was to create a back-end and a front-end service to use the model. Get the transcript and generate subtitles. I could not be more happy with the results. It was a very succesfull project that made me grow and learn a lot about academic papers. I hope you enjoy💥


```sh
docker compose up
```
Go to localhost, in the port TCP 80. You should see a front-end app.




<h2 id="techs"> Techs </h2>

| Tecnoloy                                            | Description                                                     |
| --------------------------------------------------- | ----------------------------------------------------------------|
| [HTML, CSS, JS](https://www.w3schools.com/html/)    | Create the web user interface                                   |
| [Nginx](https://www.nginx.com/)                     | Serve our html file in the 80 port                              |
| [Whisper](https://github.com/openai/whisper)        | Machine learning model that generate transcription and subtitles|
| [Docker](https://www.docker.com/)                   | Open source container managment tool                            |





<div align="center">
  <h2 id="execution">Docker</h2> 
  
  <img height=250 width=250 src="https://www.linuxnaweb.com/images/post/2018/logo-docker-compose.png" alt="docker compose image" />
  
  </div>

The dev enviroment is in docker composed file, containing both front and backend application. So all you need to do in order to run this project locally is to run the following command after cloning the project.
<br />

```
docker compose up
```

<hr />
<br/>

🔸 [Colors](https://coolors.co/3c91e6-342e37-a2d729-fafffd-fa824c)


<div align="center"> Made with love by < lazarok09 /> ❤️ </div>
