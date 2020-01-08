const pagesClass = class {
  // xmlFile class for create xml-files

  records: string[];
  openTag: string;
  closeTag: string;
  page: any;
  files: string[];
  filenamePattern: string;
  countRecords: number;
  sizeRecords: number;
	props: object;

  constructor(page: object, props: object) {
	this.page = page;
	this.props = props;
    this.files = [];
    this.records = [];
    this.countRecords = 0;
    this.sizeRecords = 0;
    this.openTag = `<?xml version="1.0" encoding="utf-8"?>
	<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    this.closeTag = `</urlset>`;
    this.filenamePattern = "";
  }

  addRecord(
    loc: string,
    priority: string,
    changefreq: string,
    lastmod: string
  ) {
    let that = this;
    let xmlUrl = this._xmlUrl(loc, priority, changefreq, lastmod);
    this.records.push(xmlUrl);
    this.countRecords++;
    this.sizeRecords += xmlUrl.length;
    if (this.countRecords >= 50000 || this.sizeRecords >= this.page.sizeLimit) {
      that._saveFile();
    }
  }

  text() {
    let res = this.openTag;
    this.records.forEach(rec => (res += rec));
	res += this.closeTag;
	return res;
  }

  _saveFile() {
//	writeFile(this.)
  }

  _xmlTag(tag: string, inner: string): string {
    return inner !== "" ? `<${tag}>${inner}<${tag}/>` : "";
  }

  _xmlUrl(
    loc: string,
    priority: string,
    changefreq: string,
    lastmod: string
  ): string {
    let $loc = this._xmlTag("loc", loc);
    let $priority = this._xmlTag("priority", priority);
    let $changefreq = this._xmlTag("changefreq", changefreq);
    let $lastmod = this._xmlTag("lastmod", lastmod);
    return `<url>${$loc}${$priority}${$changefreq}${$lastmod}</url>`;
  }
};

const sitemapClass = class {
  openTag: string;
  closeTag: string;
  pages: object[];
  activePage: object;
	props: object;

  constructor(props:object) {
	this.pages = [];
	this.props = props;
    this.activePage = {};
    this.openTag = `<?xml version="1.0" encoding="UTF-8"?>
	<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    this.closeTag = `</sitemapindex>`;
  }

  addPage(page: object): object {
	  let newPage = new pagesClass(page, this.props);
    this.pages.push(newPage);
    return this.pages[this.pages.length - 1];
  }

  /*
  addSitemap(loc: string, lastmod: String) {
    let $loc = `<loc>${loc}</loc>`;
    let $lastmod = lastmod !== "" ? `<lastmod>${lastmod}</lastmod>` : "";
    let $tag:string = `<sitemap>${$loc}${$lastmod}</sitemap>`;
    this.pages.push($tag);
  }
  */
};

const flog = function(mes: string, next = false) {
  process.stdout.write(mes + (next ? "\n" : ""));
};

const sitemapStructure = {
	props: {
  sizeLimit: 49 * 1024 * 1024, // Sitemap file size limit in Mb's
  path: "../files/sitemap/new/",
	},
  pages: [
    {
      filenamePattern: "mainpage",
      priority: "1.0",
      changefreq: "daily",
      urlPattern: `https://${hostname}/{lang}/`,
      url: ""
    },
    {
      filenamePattern: "blogs",
      priority: "1.0",
      changefreq: "daily",
      urlPattern: "https://" + hostname + "/{lang}/blogs",
      url: ""
    },
    {
      filenamePattern: "faq",
      priority: "0.6",
      changefreq: "daily",
      urlPattern: "https://" + hostname + "/{lang}/faq",
      url: ""
    },
    {
      filenamePattern: "terms-and-conditions",
      priority: "0.6",
      changefreq: "daily",
      urlPattern: "https://" + hostname + "/{lang}/terms-and-conditions",
      url: ""
    },
    {
      filename: "marketplace",
      priority: "1.0",
      changefreq: "daily",
      urlPattern: "https://" + hostname + "/{lang}/marketplace",
      rootUrl: ""
    }
  ]
};
