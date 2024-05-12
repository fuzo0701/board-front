import ResponseDto from "../response.dto";

export default interface GetRelationResponseDto extends ResponseDto {
    relativeWordList: string[];
}