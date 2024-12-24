import Footer from './Footer'
import Header from './Header'

type Props = {
	children: React.ReactNode
}

export default function Layout({ children }: Props) {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex flex-1 flex-col">{children}</main>
			<Footer />
		</div>
	)
}
