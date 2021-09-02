import { Component } from "../../../compose";

export class FuzzySearchComponent extends Component {

	fuzzy_search(keywords, _item) {
		// Returns 10 for case-perfect contain, 0 for not found
		//  	9 for perfect contain,
		//  	0 - 6 for fuzzy contain

		// **Specific use-case step**
		keywords = keywords || '';
		let item = __(_item || '');
		let item_without_hyphen = item.replace(/-/g, " ");

		let item_length = item.length;
		let query_length = keywords.length;
		let length_ratio = query_length / item_length;
		let max_skips = 3, max_mismatch_len = 2;

		if (query_length > item_length) {
			return 0;
		}

		// check for perfect string matches or
		// matches that start with the keyword
		if ([item, item_without_hyphen].includes(keywords)
				|| [item, item_without_hyphen].some((txt) => txt.toLowerCase().indexOf(keywords) === 0)) {
			return 10 + length_ratio;
		}

		if (item.indexOf(keywords) !== -1 && keywords !== keywords.toLowerCase()) {
			return 9 + length_ratio;
		}

		item = item.toLowerCase();
		keywords = keywords.toLowerCase();

		if (item.indexOf(keywords) !== -1) {
			return 8 + length_ratio;
		}

		let skips = 0, mismatches = 0;
		outer: for (let i = 0, j = 0; i < query_length; i++) {
			if (mismatches !== 0) skips++;
			if (skips > max_skips) return 0;
			let k_ch = keywords.charCodeAt(i);
			mismatches = 0;
			while (j < item_length) {
				if (item.charCodeAt(j++) === k_ch) {
					continue outer;
				}
				if(++mismatches > max_mismatch_len)  return 0 ;
			}
			return 0;
		}

		// Since indexOf didn't pass, there will be atleast 1 skip
		// hence no divide by zero, but just to be safe
		if((skips + mismatches) > 0) {
			return (5 + length_ratio)/(skips + mismatches);
		} else {
			return 0;
		}
  }
}