import axios from "axios";
import { Hotel, Zone, ElasticsearchResponse } from "../types/elasticsearch.js";
import logger from "../utils/logger.js";

const ES_HOST = "http://13.124.239.198:9200";
const HOTEL_INDEX = "hotel_portfolios_v2_00002";
const ZONE_INDEX = "zone_lists_v2_00002";

export class ElasticsearchService {
  private async search<T>(index: string, query: any): Promise<ElasticsearchResponse<T>> {
    try {
      logger.info(`Elasticsearch 검색 요청: ${index}`, { query });
      const response = await axios.post<ElasticsearchResponse<T>>(`${ES_HOST}/${index}/_search`, query);
      logger.info(`Elasticsearch 검색 응답: ${index}`, {
        total: response.data.hits.total.value,
        hits: response.data.hits.hits.length,
      });
      return response.data;
    } catch (error) {
      logger.error(`Elasticsearch 검색 오류 (${index}):`, {
        error: error instanceof Error ? error.message : error,
        query,
      });
      throw error;
    }
  }

  async searchHotels(searchTerm: string): Promise<Hotel[]> {
    logger.info(`호텔 검색 시작: "${searchTerm}"`);
    const query = {
      query: {
        bool: {
          should: [{ match: { kr_name: searchTerm } }, { match: { en_name: searchTerm } }],
        },
      },
      size: 10,
    };

    const response = await this.search<Hotel>(HOTEL_INDEX, query);
    const results = response.hits.hits.map((hit) => ({
      ...hit._source,
      _score: hit._score,
    }));
    logger.info(`호텔 검색 완료: ${results.length}건 찾음`);
    return results;
  }

  async searchZones(searchTerm: string): Promise<Zone[]> {
    logger.info(`지역 검색 시작: "${searchTerm}"`);
    const query = {
      query: {
        bool: {
          should: [{ match: { kr_name: searchTerm } }, { match: { en_name: searchTerm } }],
        },
      },
      size: 10,
    };

    const response = await this.search<Zone>(ZONE_INDEX, query);
    const results = response.hits.hits.map((hit) => ({
      ...hit._source,
      _score: hit._score,
    }));
    logger.info(`지역 검색 완료: ${results.length}건 찾음`);
    return results;
  }

  async updateDocument(index: string, id: string, doc: any): Promise<void> {
    try {
      logger.info(`Elasticsearch 문서 업데이트 시작: ${index}/${id}`, doc);
      await axios.post(`${ES_HOST}/${index}/_update/${id}`, {
        doc: {
          kr_name_manual: doc.kr_name_manual,
          use_manual_name: doc.use_manual_name,
        },
      });
      logger.info(`Elasticsearch 문서 업데이트 성공: ${index}/${id}`);
    } catch (error) {
      logger.error(`Elasticsearch 문서 업데이트 실패: ${index}/${id}`, {
        error: error instanceof Error ? error.message : error,
        doc,
      });
      throw error;
    }
  }

  async updateHotel(id: string, newName: string): Promise<void> {
    await this.updateDocument(HOTEL_INDEX, id, {
      kr_name_manual: newName,
      use_manual_name: true,
    });
  }

  async updateZone(id: string, newName: string): Promise<void> {
    await this.updateDocument(ZONE_INDEX, id, {
      kr_name_manual: newName,
      use_manual_name: true,
    });
  }
}
