import Image from 'next/image'

export function Logo() {
  return (
    <div className="relative w-8 h-8 mr-3">
      <Image
        src="./logo.jpg"
        alt="Induct AI Logo"
        width={32}
        height={32}
        className="rounded-md"
        priority
      />
    </div>
  )
}
