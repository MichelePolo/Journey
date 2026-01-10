---
layout: layouts/base.njk
title: All Posts
permalink: "blog/"
---

# All Posts

<ul class="post-list">
{% for post in collections.post %}
  <li>
    <h2><a href="{{ post.url }}">{{ post.data.title }}</a></h2>
    <div class="post-meta">
      {% if post.date %}
        <time datetime="{{ post.date | htmlDateString }}">
          {{ post.date | readableDate }}
        </time>
      {% endif %}
    </div>
    {% if post.data.subtitle %}
      <p class="post-subtitle">{{ post.data.subtitle }}</p>
    {% endif %}
  </li>
{% endfor %}
</ul>
