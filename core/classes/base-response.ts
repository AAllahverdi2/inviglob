export class BaseResponse<T> {
	message: string;
	status: number;
	timestamp: number;
	data: T;

	constructor(message: string, status: number, timestamp: number, data: T) {
		this.message = message;
		this.status = status;
		this.timestamp = timestamp;
		this.data = data;
	}
}