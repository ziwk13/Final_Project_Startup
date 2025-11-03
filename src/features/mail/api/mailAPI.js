import axios from 'axios';

const API_SERVER_HOST = "http://localhost:8080";
const baseURL = `${API_SERVER_HOST}/api/mails`;

// axios 인스턴스 생성
const mailAPI = axios.create({
	baseURL : baseURL,
	timeout : 10000,
	headers : {
		"Content-Type" : "application/json",
	}
})

// 요청 인터셉터
mailAPI.interceptors.request.use(
	(config) => {
		// 필요시 config 작업 수행
		console.log("API 요청: ", config.method.toUpperCase(), config.url);
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
)

// 응답 인터셉터
mailAPI.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		console.error("API 응답 오류 : ", error);

		// 서버로부터 응답이 도착했으나 상태코드가 에러인 상태
		if(error.response) {
			const {status, data} = error.response;
			throw new Error(`${data.message}(${status})`);
		}
		// 서버로 요청하였으나 응답이 없는 상태
		else if(error.request) {
			throw new Error("서버의 응답이 없습니다.");
		}
		// 기타
		else {
			throw new Error("알 수 없는 오류가 발생했습니다.");
		}
	}
)