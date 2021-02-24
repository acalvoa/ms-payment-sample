import { Injectable } from "@nestjs/common";
import { RequestQueryBuilder } from "@nestjsx/crud-request";

@Injectable()
export class ParserService {
  public parse(query: RequestQueryBuilder): string {
    return query.query()
      .split("&")
      .map(term => {
        term = decodeURIComponent(term);
        const frag = term.search(/\[\d*\]=/);
        if (frag !== -1) {
          term = term.substring(0,frag)+"="+encodeURIComponent(term.substring(term.indexOf("=")+1));
        }
        return term;
    }).join("&")
  }
}