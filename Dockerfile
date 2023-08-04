FROM python:3.10-slim

WORKDIR /python-docker

COPY requirements.txt requirements.txt
RUN apt-get update && apt-get install git -y
RUN pip3 install -r requirements.txt

# Clone the Whisper repository locally
RUN git clone https://github.com/openai/whisper.git /python-docker/whisper

# Install Whisper from the local directory
RUN pip3 install -e /python-docker/whisper

RUN apt-get install -y ffmpeg

COPY . .

EXPOSE 5000

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
