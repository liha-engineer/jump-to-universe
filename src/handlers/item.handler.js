import { getGameAssets } from '../init/asset.js';
import { getStage } from '../models/stage.model.js';
import { addItem } from '../models/item.model.js';

export const handleItemPickup = (userId, payload) => {
  const { items, itemUnlocks } = getGameAssets();
  const { timestamp, itemId } = payload;

  // 아이템 정보 조회
  const item = items.data.find((item) => item.id === itemId);
  if (!item) {
    return { status: 'fail', message: 'Invalid item ID!' };
  }

  // 유저의 현재 스테이지 정보 조회
  const currentStages = getStage(userId);
  if (!currentStages) {
    return { status: 'fail', message: 'No stages for this user' };
  }

  const currentStage = currentStages.at(-1).id;

  // 현재 스테이지에서 나올 수 있는 아이템인지 검증
  const allowedItems = itemUnlocks.data.find((stage) => stage.stage_id === currentStage).item_ids;
  if (!allowedItems.includes(itemId)) {
    return { status: 'fail', message: 'Not allowed item for this stage!!' };
  }

  addItem(userId, { id: itemId, timestamp });
  return { status: 'success', handler: 21 };
};
