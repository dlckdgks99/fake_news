from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelWithLMHead
from kobart import get_kobart_tokenizer
from bs4 import BeautifulSoup
import torch
import requests
from korea_news_crawler.articlecrawler import ArticleParser

model_name = "jejejun/KoBART_news"
model = AutoModelWithLMHead.from_pretrained(model_name)
tokenizer = get_kobart_tokenizer()

def get_text(res):
    if len(res) == 0:
        return
    text = res
    input_ids = tokenizer.encode(text)
    input_ids = torch.tensor(input_ids)
    input_ids = input_ids.unsqueeze(0)
    output = model.generate(input_ids, eos_token_id=1, max_length=512, num_beams=5)
    output = tokenizer.decode(output[0], skip_special_tokens=True)
    return output   

def get_news(req_url=None):
    if len(req_url) >= len("https://news.naver.com/main/list.naver"):
        url = req_url
    targetSite = str(url)
    request = requests.get(targetSite, headers={'User-Agent':'Mozilla/5.0'})
    html = request.text
    if html:
        document_content = BeautifulSoup(html, 'html.parser')
        tag_content = document_content.find_all('div', {'id': 'dic_area'})
        tag2 = tag_content[0].find_all('em',{'class': 'img_desc'})
        for i in tag2:
            i.decompose()
    text_sentence = ''
    text_sentence = text_sentence + ArticleParser.clear_content(str(tag_content[0].find_all(string=True)))
    return text_sentence

app = Flask(__name__)
CORS(app)

@app.route('/')
def rese():
    return "Hello"

@app.route('/get', methods=['POST', 'GET'])
def get_summary():
    if request.method == 'POST':
        data = request.get_json()['text']
        res = get_news(data)
        short_article = get_text(res)
        print("Generated summary:", short_article)
        # jsonify({'summary': short_article})
        return jsonify({'summary': short_article})
    else:
        return render_template("login.html")

if __name__ == '__main__':
    app.run(debug=True, port=8080)
