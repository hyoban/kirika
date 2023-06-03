import { useTranslation } from "react-i18next"

export default function LanguageSwitch() {
	const { i18n } = useTranslation()

	const changeLanguage = () => {
		if (Array.isArray(i18n.options.supportedLngs)) {
			const allLangs = i18n.options.supportedLngs.filter(
				(i) => i !== "cimode"
			) as string[]
			const currentLang = i18n.language
			const nextLang =
				allLangs[(allLangs.indexOf(currentLang) + 1) % allLangs.length]
			i18n.changeLanguage(nextLang).catch((e) => console.error(e))
			window.localStorage.setItem("i18currentLang", nextLang)
		}
	}

	return (
		<button className="i-carbon-translate" onClick={changeLanguage}></button>
	)
}
