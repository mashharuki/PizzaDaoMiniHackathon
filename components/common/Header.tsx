import { Button, Icon } from '@/components/common';
import { Address, Avatar, EthBalance, Identity, Name } from '@coinbase/onchainkit/identity';
import { useAddFrame, useMiniKit } from '@coinbase/onchainkit/minikit';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { useCallback, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';

/**
 * ヘッダーコンポーネント
 */
export const Header = () => {
  const { context } = useMiniKit();
  const addFrame = useAddFrame();
  const { address, isConnected } = useAccount();

  const [frameAdded, setFrameAdded] = useState(false);

  // フレームをユーザーに追加してもらう（クライアントで保存操作を促す）
  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  // ヘッダー右上の「Save Frame」ボタンの表示制御
  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="p-4 text-[var(--app-accent)]"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex animate-fade-out items-center space-x-1 text-sm font-medium text-[#0052FF]">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  // My NFT ボタン（Rarible Testnet への導線）
  const myNftButton = useMemo(() => {
    const url = address ? `https://testnet.rarible.com/user/${address}/owned` : '';
    const handleClick = () => {
      if (!url) return;
      window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={!isConnected}
        className="p-4"
        icon={<Icon name="arrow-right" size="sm" />}
      >
        My NFT
      </Button>
    );
  }, [address, isConnected]);

  return (
    <header className="mb-3 flex h-11 w-full items-center justify-between">
      <div>
        <div className="flex items-center space-x-2">
          <Wallet className="z-10">
            <ConnectWallet>
              <Name className="text-inherit" />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pb-2 pt-3" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {saveFrameButton}
        {myNftButton}
      </div>
    </header>
  );
};
