import { getGameAssets } from "../init/asset.js";
import { setStage, getStage } from "../models/stage.model.js";

export const gameStart = (uuid, payload) => {
    
    const { stages } = getGameAssets();
    // stages 배열에서 0번째 - 첫번째 스테이지
    setStage(uuid, stages.data[0].id, payload.timestamp);
    console.log('Stage: ', getStage(uuid));
    
    return { status : "success "};
}

export const gameEnd = (uuid, payload) => {
    // 클라 -> 서버로 게임종료시점과 점수를 전달할 것
    const { timestamp : gameEndTime, score } = payload;
    const stages = getStage(uuid);

    if(stages.length) {
        return { status : 'fail', message : 'No stages found for this user'}
    }
    // 각 스테이지의 지속시간을 계산하여 총점수 계산
    let totalscore = 0;
    
    stages.forEach((stages, index) => {
        let stageEndTime;
        if (index === stages.length - 1) {
            stageEndTime = gameEndTime;
        } else {
            stageEndTime = stages[index + 1].timestamp;
        }

        const stageDuration = (startEndTime - stageEndTime.timestamp) / 1000;
        totalscore += stageDuration; // 1초당 1점이라 가정
    })

    // 점수와 타임스탬프 검증 - 오차범위는 5 정도
    if (Math.abs(score - totalscore) > 5) {
        return { status : 'fail', message : 'Score verification failed'}
    }

    // DB에 저장한다고 가정하면 아래와 같이 쓸 수 있을 것 
    // setResult(userId, score, timestamp) 

    return { status : "success ", message : 'Game ended'};
}