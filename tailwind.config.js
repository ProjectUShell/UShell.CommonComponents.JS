hue = 255
sat = 5
satDark = 5

lightCurve = [0, 1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 18, 21, 24]
lightCurveDark = [0, 1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 18, 21, 24]
ligthCurveWeight = 1.2
ligthCurveWeightDark = 1.0
satCurve = [0, 1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 18, 21, 24]
satCurveDark = [0, 1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 18, 21, 24]

function getBg(i, d) {
  if (d) {
    light =
      lightCurveDark[lightCurveDark.length - 1] * ligthCurveWeightDark -
      lightCurveDark[i] * ligthCurveWeightDark
    maxSatStep = satCurveDark[satCurveDark.length - 1]
    s = satDark - (satCurveDark[i] / maxSatStep) * satDark
    return 'hsl(' + hue + ',' + s + ',' + light + ')'
  } else {
    light = 100 - lightCurve[i] * ligthCurveWeight
    maxSatStep = satCurve[satCurve.length - 1]
    s = sat - (satCurve[i] / maxSatStep) * sat

    return 'hsl(' + hue + ',' + s + ',' + light + ')'
  }
}

module.exports = {
  darkMode: 'class',
  content: [
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
    './src/**/**/*.{js,ts,jsx,tsx}',
    './src/**/**/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Add your custom colors here
        customRed: '#FF0000',
        customBlue: '#0000FF',
        primary2: 'var(--color-primary)',
        primary: 'rgb(var(--color-primary))',
        secondary: 'rgb(var(--color-secondary))',
        texttest: '#d2bab0',
        textone: 'var(--color-text-one)',
        texttwo: 'var(--color-text-two)',
        backgroundone: 'rgb(var(--color-background-one))',
        backgroundtwo: 'rgb(var(--color-background-two))',
        backgroundthree: 'rgb(var(--color-background-three))',
        backgroundfour: 'rgb(var(--color-background-four))',
        backgroundonedark: 'var(--color-background-one-dark)',
        backgroundtwodark: 'var(--color-background-two-dark)',
        backgroundthreedark: 'var(--color-background-three-dark)',
        backgroundfourdark: 'var(--color-background-four-dark)',
        textonedark: 'var(--color-text-one-dark)',
        texttwodark: 'var(--color-text-two-dark)',
        accent: 'rgb(var(--color-accent))',
        bg1: getBg(0),
        bg2: getBg(1),
        bg3: getBg(2),
        bg4: getBg(3),
        bg5: getBg(4),
        bg6: getBg(5),
        bg7: getBg(6),
        bg8: getBg(7),
        bg9: getBg(8),
        bg10: getBg(9),
        bg11: getBg(10),
        bg12: getBg(11),
        bg13: getBg(12),
        bg14: getBg(13),
        bg1dark: getBg(0, 1),
        bg2dark: getBg(1, 1),
        bg3dark: getBg(2, 1),
        bg4dark: getBg(3, 1),
        bg5dark: getBg(4, 1),
        bg6dark: getBg(5, 1),
        bg7dark: getBg(6, 1),
        bg8dark: getBg(7, 1),
        bg9dark: getBg(8, 1),
        bg10dark: getBg(9, 1),
        prim1: 'var(--color-prim-100)',
        prim2: 'var(--color-prim-200)',
        prim3: 'var(--color-prim-300)',
        prim4: 'var(--color-prim-400)',
        prim5: 'var(--color-prim-500)',
        prim6: 'var(--color-prim-600)',
        content: 2 == 1 ? getBg(0) : getBg(0),
        topbar: 2 == 1 ? getBg(4) : getBg(8),
        topbarshadow: 2 == 1 ? getBg(0) : getBg(0),
        menu: 2 == 1 ? getBg(4) : getBg(6),
        menuHover: 2 == 1 ? getBg(0) : getBg(1),
        menuBorder: 2 == 1 ? getBg(6) : getBg(9),
        menu1: 2 == 1 ? getBg(4) : getBg(1),
        menuHover1: 2 == 1 ? getBg(0) : getBg(4),
        tabBg: 2 == 1 ? getBg(6) : getBg(0),
        tab: 2 == 1 ? getBg(6) : getBg(2),
        tabHover: 2 == 1 ? getBg(6) : getBg(7),
        tabBorder: 2 == 1 ? getBg(6) : getBg(8),
        tabSelected: 2 == 1 ? getBg(6) : getBg(4),
        navigation: 2 == 1 ? getBg(4) : getBg(4),
        navigationHover: 2 == 1 ? getBg(5) : getBg(5),
        navigationBorder: 2 == 1 ? getBg(5) : getBg(8),
        breadcrumb: 2 == 1 ? getBg(0) : getBg(4),
        breadcrumbHover: 2 == 1 ? getBg(0) : getBg(8),
        breadcrumbBorder: 2 == 1 ? getBg(0) : getBg(8),
        toolbar: 2 == 1 ? getBg(0) : getBg(4),
        toolbarBorder: 2 == 1 ? getBg(0) : getBg(2),
        toolbarHover: 2 == 1 ? getBg(0) : getBg(8),
        table: 2 == 1 ? getBg(0) : getBg(0),
        tableSelected: 2 == 1 ? getBg(0) : getBg(0),
        tableHover: 2 == 1 ? getBg(0) : getBg(4),
        tableHead: 2 == 1 ? getBg(0) : getBg(2),
        hoverItem: 2 == 1 ? getBg(0) : getBg(0),
        selectedItem: 2 == 1 ? getBg(0) : getBg(0),
        hairlineMenu: 2 == 1 ? getBg(0) : getBg(0),
        hairlineNavigation: 2 == 1 ? getBg(0) : getBg(0),
        contentDark: 2 == 1 ? getBg(0) : getBg(0, 1),
        topbarDark: 2 == 1 ? getBg(4) : getBg(8, 1),
        topbarshadowDark: 2 == 1 ? getBg(0) : getBg(0, 1),
        topbarBorderDark: 2 == 1 ? getBg(0) : getBg(12, 1),
        menuDark: 2 == 1 ? getBg(4) : getBg(6, 1),
        menuHoverDark: 2 == 1 ? getBg(0) : getBg(1, 1),
        menuBorderDark: 2 == 1 ? getBg(6) : getBg(9, 1),
        menu1Dark: 2 == 1 ? getBg(4) : getBg(1, 1),
        menuHover1Dark: 2 == 1 ? getBg(0) : getBg(4, 1),
        tabBgDark: 2 == 1 ? getBg(6) : getBg(0, 1),
        tabDark: 2 == 1 ? getBg(6) : getBg(2, 1),
        tabHoverDark: 2 == 1 ? getBg(6) : getBg(7, 1),
        tabBorderDark: 2 == 1 ? getBg(6) : getBg(8, 1),
        tabSelectedDark: 2 == 1 ? getBg(6) : getBg(4, 1),
        navigationDark: 2 == 1 ? getBg(4) : getBg(4, 1),
        navigationHoverDark: 2 == 1 ? getBg(5) : getBg(5, 1),
        navigationBorderDark: 2 == 1 ? getBg(5) : getBg(8, 1),
        breadcrumbDark: 2 == 1 ? getBg(0) : getBg(4, 1),
        breadcrumbHoverDark: 2 == 1 ? getBg(0) : getBg(8, 1),
        breadcrumbBorderDark: 2 == 1 ? getBg(0) : getBg(8, 1),
        toolbarDark: 2 == 1 ? getBg(0) : getBg(4, 1),
        toolbarBorderDark: 2 == 1 ? getBg(0) : getBg(2, 1),
        toolbarHoverDark: 2 == 1 ? getBg(0) : getBg(8, 1),
        tableDark: 2 == 1 ? getBg(0) : getBg(0, 1),
        tableSelectedDark: 2 == 1 ? getBg(0) : getBg(0, 1),
        tableHoverDark: 2 == 1 ? getBg(0) : getBg(4, 1),
        tableHeadDark: 2 == 1 ? getBg(0) : getBg(2, 1),
        hoverItemDark: 2 == 1 ? getBg(0) : getBg(0, 1),
        selectedItemDark: 2 == 1 ? getBg(0) : getBg(0, 1),
        hairlineMenuDark: 2 == 1 ? getBg(0) : getBg(0, 1),
        hairlineNavigationDark: 2 == 1 ? getBg(0) : getBg(0, 1),
        // ...
      },
    },
  },
  variants: {
    backgroundColor: ({ after }) => after(['disabled']),
    textColor: ({ after }) => after(['disabled']),
    extend: {
      width: ['focus'],
    },
  },
  plugins: [],
}
