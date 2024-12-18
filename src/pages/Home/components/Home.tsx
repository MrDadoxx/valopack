import { SectionLink } from './SectionLink.tsx'
import vyzeImage from '../assets/images/vyse.webp'
import vandalImage from '../assets/images/vandal.webp'
import omenImage from '../assets/images/omen.webp'
import { useEffect } from 'react'
import { useSettings } from '../../../hooks/useSettings.ts'
import { useUser } from '../../../hooks/useUser.ts'
import { useShop } from '../../Shop/hooks/useShop.ts'
import { paths } from '../../../valopack.config.ts'
import { Header } from '../../../components/Header.tsx'

export default function Home () {
  const { texts, updatePage } = useSettings()
  const { setSelectorVisible } = useUser()
  const { setOwnedProduct, setSelectedProduct } = useShop()

  useEffect(() => {
    setSelectorVisible(false)
    setOwnedProduct(null)
    setSelectedProduct(null)
    updatePage('home')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className='w-full min-h-[100dvh] flex items-center justify-center'>
      <Header />

      <article className='grid xl:grid-cols-[1.2fr_1fr] xl:grid-rows-[1fr_1fr] md:grid-rows-3 gap-[3%] p-[3%] w-full min-h-[100dvh] pt-[20vh]'>
        <SectionLink
          to={paths.play}
          text={texts.play}
          image={vyzeImage}
          className='flex justify-center items-end relative w-full xl:h-full md:aspect-video xl:col-[1] xl:row-[1/span_2] text-[clamp(100px,9rem,200px)] [background:linear-gradient(43deg,#161526_10%,#6052b6_100%)] border-v_aqua border-[5px] hover:border-white'
          imgClassName='w-[clamp(300px,80%,500px)]'
        />
        <SectionLink
          to={paths.shop}
          text={texts.shop}
          image={vandalImage}
          className='flex justify-center items-center w-full xl:h-full md:aspect-video text-[clamp(100px,_5rem,_200px)] border-[5px] border-[#e98711] [background:linear-gradient(43deg,#361525_10%,#95426b_100%)] hover:border-[#f4daba]'
          imgClassName='w-[clamp(300px,_80%,_500px)]'
        />
        <SectionLink
          to={paths.team}
          text={texts.team}
          image={omenImage}
          className='flex justify-end items-end w-full xl:h-full md:aspect-video text-[clamp(100px,_5rem,_200px)] border-[5px] border-[#5c67c8] [background:linear-gradient(43deg,#0a2759_10%,#2b578b_100%)] hover:border-[#c0c4ec]'
          imgClassName='w-[clamp(300px,_45%,_500px)]'
        />
      </article>
    </main>
  )
}
