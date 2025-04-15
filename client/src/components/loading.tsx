type Props = {
  active: boolean;
};

export default function Loading({ active }: Props) {
  return (
    <div className='flex flex-col items-center justify-center h-20'>
      {active && (
        <div className='w-10 h-10 animate-spin rounded-full border-t-4 border-border border-solid' />
      )}
    </div>
  );
}
