"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _core = require("@citation-js/core");
var _date = require("@citation-js/date");
var _biblatexTypes = _interopRequireDefault(require("./biblatexTypes.json"));
var _shared = require("./shared.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const nonSpec = [{
  source: 'note',
  target: 'accessed',
  when: {
    source: false,
    target: {
      note: false,
      addendum: false
    }
  },
  convert: {
    toSource(accessed) {
      return `[Online; accessed ${(0, _date.format)(accessed)}]`;
    }
  }
}, {
  source: 'numpages',
  target: 'number-of-pages',
  when: {
    source: {
      pagetotal: false
    },
    target: false
  }
}, {
  source: 'pmid',
  target: 'PMID',
  when: {
    source: {
      eprinttype(type) {
        return type !== 'pmid';
      },
      archiveprefix(type) {
        return type !== 'pmid';
      }
    },
    target: false
  }
}, {
  source: 'pmcid',
  target: 'PMCID',
  when: {
    target: false
  }
}, {
  source: 's2id',
  target: 'custom',
  convert: {
    toTarget(S2ID) {
      return {
        S2ID
      };
    },
    toSource({
      S2ID
    }) {
      return S2ID;
    }
  }
}];
const aliases = [{
  source: 'annote',
  target: 'annote',
  when: {
    source: {
      annotation: false
    },
    target: false
  }
}, {
  source: 'address',
  target: 'publisher-place',
  convert: _shared.Converters.PICK,
  when: {
    source: {
      location: false
    },
    target: false
  }
}, {
  source: ['eprint', 'archiveprefix'],
  target: 'PMID',
  convert: _shared.Converters.EPRINT,
  when: {
    source: {
      eprinttype: false
    },
    target: false
  }
}, {
  source: 'journal',
  target: 'container-title',
  when: {
    source: {
      maintitle: false,
      booktitle: false,
      journaltitle: false
    },
    target: false
  }
}, {
  source: 'school',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    source: {
      institution: false,
      organization: false,
      publisher: false
    },
    target: false
  }
}];
var _default = exports.default = new _core.util.Translator([...aliases, ...nonSpec, {
  source: 'abstract',
  target: 'abstract'
}, {
  source: 'urldate',
  target: 'accessed',
  convert: _shared.Converters.DATE
}, {
  source: 'annotation',
  target: 'annote'
}, {
  source: ['author', 'author+an:orcid'],
  target: 'author',
  convert: _shared.Converters.NAMES_ORCID
}, {
  source: 'library',
  target: 'call-number'
}, {
  source: 'chapter',
  target: 'chapter-number'
}, {
  source: 'bookauthor',
  target: 'container-author',
  convert: _shared.Converters.NAMES
}, {
  source: ['maintitle', 'mainsubtitle', 'maintitleaddon'],
  target: 'container-title',
  when: {
    source: true,
    target: {
      'number-of-volumes': true
    }
  },
  convert: _shared.Converters.TITLE
}, {
  source: ['booktitle', 'booksubtitle', 'booktitleaddon'],
  target: 'container-title',
  when: {
    source: {
      maintitle: false
    },
    target: {
      'number-of-volumes': false,
      type(type) {
        return !type || !type.startsWith('article');
      }
    }
  },
  convert: _shared.Converters.TITLE
}, {
  source: ['journaltitle', 'journalsubtitle', 'journaltitleaddon'],
  target: 'container-title',
  when: {
    source: {
      [_shared.TYPE]: 'article'
    },
    target: {
      type: ['article', 'article-newspaper', 'article-journal', 'article-magazine']
    }
  },
  convert: _shared.Converters.TITLE
}, {
  source: 'shortjournal',
  target: 'container-title-short',
  when: {
    source: {
      [_shared.TYPE]: 'article'
    },
    target: {
      type: ['article', 'article-newspaper', 'article-journal', 'article-magazine']
    }
  }
}, {
  source: 'shortjournal',
  target: 'journalAbbreviation',
  when: {
    source: false,
    target: {
      'container-title-short': false
    }
  }
}, {
  source: 'number',
  target: 'collection-number',
  when: {
    source: {
      [_shared.TYPE]: ['book', 'mvbook', 'inbook', 'bookinbook', 'suppbook', 'collection', 'mvcollection', 'incollection', 'suppcollection', 'manual', 'suppperiodical', 'proceedings', 'mvproceedings', 'refererence']
    },
    target: {
      type: ['bill', 'book', 'broadcast', 'chapter', 'dataset', 'entry', 'entry-dictionary', 'entry-encyclopedia', 'figure', 'graphic', 'interview', 'legislation', 'legal_case', 'manuscript', 'map', 'motion_picture', 'musical_score', 'pamphlet', 'post', 'post-weblog', 'personal_communication', 'review', 'review-book', 'song', 'speech', 'thesis', 'treaty', 'webpage']
    }
  }
}, {
  source: 'series',
  target: 'collection-title'
}, {
  source: 'shortseries',
  target: 'collection-title-short'
}, {
  source: 'doi',
  target: 'DOI'
}, {
  source: 'edition',
  target: 'edition'
}, {
  source: 'editor',
  target: 'editor',
  convert: _shared.Converters.NAMES
}, {
  source: [_shared.TYPE, 'entrysubtype', 'type'],
  target: ['type', 'genre'],
  convert: {
    toTarget(type, subtype, typeKey) {
      if (!typeKey) {
        if (type === 'mastersthesis') {
          typeKey = 'mathesis';
        }
        if (type === 'phdthesis') {
          typeKey = 'phdthesis';
        }
        if (type === 'techreport') {
          typeKey = 'techreport';
        }
      }
      return [_biblatexTypes.default.source[type] || 'document', typeKey || subtype];
    },
    toSource(type, genre) {
      const sourceType = _biblatexTypes.default.target[type] || 'misc';
      return genre in _shared.TYPE_KEYS ? [sourceType, undefined, genre] : [sourceType, genre];
    }
  }
}, {
  source: _shared.TYPE,
  when: {
    target: {
      type: false
    }
  },
  convert: {
    toSource() {
      return 'misc';
    }
  }
}, {
  source: 'eventdate',
  target: 'event-date',
  convert: _shared.Converters.DATE
}, {
  source: 'venue',
  target: 'event-place'
}, {
  source: ['eventtitle', 'eventtitleaddon'],
  target: 'event-title',
  convert: _shared.Converters.EVENT_TITLE
}, {
  source: ['eventtitle', 'eventtitleaddon'],
  target: 'event',
  convert: _shared.Converters.EVENT_TITLE,
  when: {
    source: false,
    target: {
      'event-title': false
    }
  }
}, {
  source: _shared.LABEL,
  target: ['id', 'citation-key', 'author', 'issued', 'year-suffix', 'title'],
  convert: _shared.Converters.LABEL
}, {
  source: 'isbn',
  target: 'ISBN'
}, {
  source: 'issn',
  target: 'ISSN'
}, {
  source: 'issue',
  target: 'issue',
  when: {
    source: {
      number: false,
      [_shared.TYPE]: ['article', 'periodical']
    },
    target: {
      issue(issue) {
        return typeof issue === 'string' && !issue.match(/\d+/);
      },
      type: ['article', 'article-journal', 'article-newspaper', 'article-magazine', 'periodical']
    }
  }
}, {
  source: 'number',
  target: 'issue',
  when: {
    source: {
      [_shared.TYPE]: ['article', 'periodical', 'inproceedings']
    },
    target: {
      issue(issue) {
        return issue && (typeof issue === 'number' || issue.match(/\d+/));
      },
      type: ['article', 'article-journal', 'article-newspaper', 'article-magazine', 'paper-conference', 'periodical']
    }
  }
}, {
  source: 'date',
  target: 'issued',
  convert: _shared.Converters.DATE
}, {
  source: ['year', 'month', 'day'],
  target: 'issued',
  convert: _shared.Converters.YEAR_MONTH,
  when: {
    source: {
      date: false
    },
    target: false
  }
}, {
  source: 'location',
  target: 'jurisdiction',
  when: {
    source: {
      type: 'patent'
    },
    target: {
      type: 'patent'
    }
  }
}, {
  source: 'keywords',
  target: 'keyword',
  convert: _shared.Converters.KEYWORDS
}, {
  source: 'language',
  target: 'language',
  convert: _shared.Converters.PICK
}, {
  source: 'langid',
  target: 'language',
  when: {
    source: {
      language: false
    },
    target: false
  }
}, {
  source: 'note',
  target: 'note'
}, {
  source: 'addendum',
  target: 'note',
  when: {
    source: {
      note: false
    },
    target: false
  }
}, {
  source: 'eid',
  target: 'number',
  when: {
    target: {
      type: ['article-journal']
    }
  }
}, {
  source: ['isan', 'ismn', 'isrn', 'iswc'],
  target: 'number',
  convert: _shared.Converters.STANDARD_NUMBERS,
  when: {
    source: {
      [_shared.TYPE](type) {
        return type !== 'patent';
      }
    },
    target: {
      type(type) {
        return type !== 'patent';
      }
    }
  }
}, {
  source: 'number',
  target: 'number',
  when: {
    source: {
      [_shared.TYPE]: ['patent', 'report', 'techreport', 'legislation']
    },
    target: {
      type: ['patent', 'report', 'legislation']
    }
  }
}, {
  source: 'origdate',
  target: 'original-date',
  convert: _shared.Converters.DATE
}, {
  source: 'origlocation',
  target: 'original-publisher-place',
  convert: _shared.Converters.PICK
}, {
  source: 'origpublisher',
  target: 'original-publisher',
  convert: _shared.Converters.PICK
}, {
  source: 'origtitle',
  target: 'original-title'
}, {
  source: 'pages',
  target: 'page',
  when: {
    source: {
      bookpagination: [undefined, 'page']
    }
  },
  convert: _shared.Converters.PAGES
}, {
  source: 'pagetotal',
  target: 'number-of-pages'
}, {
  source: 'part',
  target: 'part-number'
}, {
  source: ['eprint', 'eprinttype'],
  target: 'PMID',
  convert: _shared.Converters.EPRINT
}, {
  source: 'location',
  target: 'publisher-place',
  convert: _shared.Converters.PICK
}, {
  source: 'publisher',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    source: true,
    target: {
      type: ['article', 'article-journal', 'article-magazine', 'article-newspaper', 'bill', 'book', 'broadcast', 'chapter', 'classic', 'collection', 'dataset', 'document', 'entry', 'entry-dictionary', 'entry-encyclopedia', 'event', 'figure', 'graphic', 'hearing', 'interview', 'legal_case', 'legislation', 'manuscript', 'map', 'motion_picture', 'musical_score', 'pamphlet', 'paper-conference', 'patent', 'performance', 'periodical', 'personal_communication', 'post', 'post-weblog', 'regulation', 'review', 'review-book', 'software', 'song', 'speech', 'standard', 'treaty']
    }
  }
}, {
  source: 'organization',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    source: {
      publisher: false
    },
    target: {
      type: 'webpage'
    }
  }
}, {
  source: 'institution',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    source: {
      publisher: false,
      organization: false
    },
    target: {
      type: ['report', 'thesis']
    }
  }
}, {
  source: 'howpublished',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    source: {
      howpublished(howPublished) {
        return howPublished && !howPublished.startsWith('http');
      },
      publisher: false,
      organization: false,
      institution: false
    },
    target: {
      type: 'manuscript'
    }
  }
}, {
  source: ['pages', 'bookpagination'],
  target: 'section',
  when: {
    source: {
      bookpagination: 'section'
    },
    target: {
      page: false
    }
  },
  convert: {
    toTarget(section) {
      return section;
    },
    toSource(section) {
      return [section, 'section'];
    }
  }
}, {
  source: 'pubstate',
  target: 'status',
  convert: _shared.Converters.STATUS
}, {
  source: 'shorttitle',
  target: 'title-short'
}, {
  source: 'shorttitle',
  target: 'shortTitle',
  when: {
    source: false,
    target: {
      'title-short': false
    }
  }
}, {
  source: ['title', 'subtitle', 'titleaddon'],
  target: 'title',
  convert: _shared.Converters.TITLE
}, {
  source: 'translator',
  target: 'translator',
  convert: _shared.Converters.NAMES
}, {
  source: 'url',
  target: 'URL'
}, {
  source: 'howpublished',
  target: 'URL',
  convert: _shared.Converters.HOW_PUBLISHED,
  when: {
    source: {
      url: false
    },
    target: false
  }
}, {
  source: 'version',
  target: 'version'
}, {
  source: 'volume',
  target: 'volume'
}, {
  source: 'volumes',
  target: 'number-of-volumes'
}, {
  source: ['issuetitle', 'issuesubtitle', 'issuetitleaddon'],
  target: 'volume-title',
  convert: _shared.Converters.TITLE
}]);