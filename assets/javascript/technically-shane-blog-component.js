import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

class TechnicallyShaneBlogPost extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    const blogPost = await this.loadContent();

    const wrapper = document.createElement("div");
    wrapper.classList.add('wrapper');
    wrapper.innerHTML = marked.parse(blogPost);

    const style = document.createElement("style");
    style.textContent = `
      .wrapper {
        background-color: #23234b;

        border-color: #02022e;
        border-radius: 10px;

        color: #cacbcf;
      }

      .wrapper > * {
        padding-left: 5px;
        padding-right: 5px;
      }

      .wrapper:last-child {
        padding-bottom: 10px;
      }

      h1 {
        border-radius: 10px 10px 0 0;
        background-color: #02022e;
      }

      img {
        max-width: 100%;
        border-radius: 10px;
      }

      ul, ol {
        list-style-position: inside;
      }
    `;

    wrapper.appendChild(style);

    shadow.appendChild(wrapper);
  }

  async loadContent() {
    const contentUrl = this.getAttribute("content");
    const selector = this.getAttribute("body-selector");

    return fetch(contentUrl)
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        return doc.querySelector(selector).innerHTML;
      });
  }
}

customElements.define('technically-shane-blog-post', TechnicallyShaneBlogPost);
