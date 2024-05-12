import { getLatestBoardListRequest, getPopularListRequest, getTop3BoardListRequest } from 'apis';
import { ResponseDto } from 'apis/response';
import { GetLatestBoardListResponseDto, GetTop3ResponseDto } from 'apis/response/board';
import BoardItem from 'components/BoardItem';
import Pagination from 'components/Pagination';
import Top3Item from 'components/Top3Item';
import { SEARCH_PATH } from 'constant';
import { usePagination } from 'hooks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoardListItem } from 'types/interface';
import './style.css';
import { GetPopularListResponseDto } from 'apis/response/search';

//          component: 메인 화면 컴포넌트          //
export default function Main() {
  // function : 네이게이트 함수 //
  const navigate = useNavigate();
  //          component: 메인 화면 상단 컴포넌트          //
  const MainTop = () => {

    // state : 주간 top3 게시물 리스트 상태 //
    const [top3BoardList, setTop3BoardList] = useState<BoardListItem[]>([]);
    // function : get top 3 board list response 처리 함수 //
    const getTop3BoardListResponse = (responseBody: GetTop3ResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const { code } = responseBody;
      if(code === 'DBE') alert('데이터베이스 오류입니다.');
      if(code !== 'SU') return;

      const { top3List } = responseBody as GetTop3ResponseDto;
      setTop3BoardList(top3List);
    }
    // effect: 첫 마운트시 실행될 함수 //
    useEffect(()=> {
      //setTop3BoardList(top3BoardListMock);
      getTop3BoardListRequest().then(getTop3BoardListResponse);
    }, []);

    //  render : 메인 화면 상단 렌더링 //  
    return (
      <div id="main-top-wrapper">
        <div className="main-top-container">
          <div className='main-top-title'>
            {'JINS BOARD에서 \n 다양한 이야기를 나눠보세요.'}
          </div>
          <div className='main-top-content-box'>
            <div className='main-top-content-title'>{'주간 TOP 3 게시글'}</div>
            <div className='main-top-contents'>
              {top3BoardList.map((top3ListItem,index) => <Top3Item top3ListItem={top3ListItem} key={index}/> )}
            </div>
          </div>
        </div>
      </div>
    )  
  }
  //          component: 메인 화면 하단 컴포넌트          //
  const MainBottom = () => {
    // state : 페이지 네이션 관련 상태 //
    const { currentPage, setCurrentPage, currentSection, setCurrentSection, viewList,
        viewPageList, totalSection, setTotalList } = usePagination<BoardListItem>(5);
    // state : 임기 검색어 리스트 상태 //
    const [popularWordList, setPopularWordList] = useState<string[]>([]);
    // event handler: 인기 검색어 클릭 이벤트 처리 //
   const onPopularWordClickHandler = (word: string) => {
      navigate(SEARCH_PATH(word));
    }
    // function : get latest board list response 처리 함수 //
    const getLatestBoardListResponse = (responseBody: GetLatestBoardListResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const { code } = responseBody;
      if(code === 'DBE') alert('데이터베이스 오류입니다.');
      if(code !== 'SU') return;

      const {latestList} = responseBody as GetLatestBoardListResponseDto;
      setTotalList(latestList);
    }
    // function : get popular list response  처리 함수 //
    const getPopularListResponse = (responseBody: GetPopularListResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const { code } = responseBody;
      if(code === 'DBE') alert('데이터베이스 오류입니다.');
      if(code !== 'SU') return;

      const {popularWordList} = responseBody as GetPopularListResponseDto;
      setPopularWordList(popularWordList);
    }
    // effect: 첫 마운트시 실행될 함수 //
    useEffect(()=> {
      getLatestBoardListRequest().then(getLatestBoardListResponse);
      getPopularListRequest().then(getPopularListResponse);
    }, []);
    //  render : 메인 화면 하단 렌더링 //  
    return (
      <div id="main-bottom-wrapper">
        <div className='main-bottom-container'>
          <div className='main-bottom-title'>{'최신 게시물'}</div>
          <div className='main-bottom-content-box'>
            <div className='main-bottom-current-contents'>
              {viewList.map(boardListItem => <BoardItem boardListItem={boardListItem} key={boardListItem.boardNumber}/>)}
            </div>
            <div className='main-bottom-popular-box'>
                <div className="main-bottom-popular-card">
                  <div className="main-bottom-popular-card-container">
                    <div className='main-bottom-popular-card-title'>{'인기 검색어'}</div>
                    <div className='main-bottom-popular-card-contents'>
                      {popularWordList.map((word, index) => <div className="word-badge" onClick={() => onPopularWordClickHandler(word)} key={index}>{word}</div> )}
                    </div>
                  </div>
                </div>
            </div>
          </div>
          <div className='main-bottom-pagination-box'>
            <Pagination 
              currentPage={currentPage}
              currentSection={currentSection}
              setCurrentPage={setCurrentPage}
              setCurrentSection={setCurrentSection}
              viewPageList={viewPageList}
              totalSection={totalSection}
            />
          </div>
        </div>
      </div>
    )  
  }
  //  render : 메인 화면 렌더링 //  
  return (
    <>
      <MainTop/>
      <MainBottom/>
    </>
  )
}
