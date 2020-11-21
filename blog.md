---
layout: default
title: Blog
comments: false
---
<ul style="list-style-type:none;">
  {% for post in site.posts %}
    <li>
      <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
      <small>{{ post.date | date: "%B %e, %Y" }}</small>
      {{ post.excerpt }}
    </li>
    <br />
  {% endfor %}
<ul>