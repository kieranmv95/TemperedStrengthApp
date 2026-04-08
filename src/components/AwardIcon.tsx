import React, { useId, useMemo } from 'react';
import Svg, {
    Circle,
    ClipPath,
    Defs,
    G,
    LinearGradient,
    Path,
    RadialGradient,
    Rect,
    Stop,
    Text as SvgText,
} from 'react-native-svg';

export type AwardIconVariant = 'bronze' | 'silver' | 'platinum';

type Palette = {
    shieldBase: string;
    borderTop: string;
    borderBottom: string;
    bannerBase: string;
    bannerText: string;
    trophy: string;
};

const PALETTES: Record<AwardIconVariant, Palette> = {
    platinum: {
        shieldBase: '#1B3A5C',
        borderTop: '#A8C8E8',
        borderBottom: '#4A7AAE',
        bannerBase: '#5B92C4',
        bannerText: 'rgba(0,0,0,0.36)',
        trophy: '#FFFFFF',
    },
    silver: {
        shieldBase: '#58667A',
        borderTop: '#D0D8E8',
        borderBottom: '#7888A0',
        bannerBase: '#C8D0DA',
        bannerText: 'rgba(0,0,0,0.42)',
        trophy: '#FFFFFF',
    },
    bronze: {
        shieldBase: '#A24A27',
        borderTop: '#DCA870',
        borderBottom: '#A06030',
        bannerBase: '#D6862A',
        bannerText: 'rgba(0,0,0,0.38)',
        trophy: '#FFFFFF',
    },
};

export type AwardIconProps = Omit<
    React.ComponentProps<typeof Svg>,
    'width' | 'height' | 'viewBox'
> & {
    variant?: AwardIconVariant;
    text: string;
    size?: number;
    fontSize?: number;
};

const SHIELD_PATH =
    'M47.7258 98.3522C47.4773 91.5339 47.3531 88.1247 48.6567 84.4937C49.7748 81.3793 51.8313 78.3654 54.3234 76.1886C57.2291 73.6507 61.4485 72.1731 69.8875 69.2179C87.8437 62.9299 105.167 54.497 121.5 44.6987C128.923 40.2451 132.635 38.0183 135.83 37.3168C139.002 36.6203 141.237 36.6203 144.408 37.3168C147.603 38.0183 151.315 40.2451 158.739 44.6987C175.072 54.497 192.395 62.9299 210.351 69.2179C218.79 72.1731 223.009 73.6507 225.915 76.1886C228.407 78.3654 230.463 81.3793 231.582 84.4937C232.885 88.1247 232.761 91.5339 232.512 98.3522C231.805 117.756 228.303 146.593 215.502 172.621C198.622 206.945 170.429 229.459 153.722 240.549C150.054 242.984 148.22 244.201 144.765 245.027C142.369 245.599 137.869 245.599 135.474 245.027C132.018 244.201 130.184 242.984 126.516 240.549C109.81 229.459 81.6164 206.945 64.736 172.621C51.9354 146.593 48.433 117.756 47.7258 98.3522Z';

// Outer + middle shield combined; with evenodd this fills only the border ring.
const BORDER_RING_PATH =
    'M135.83 37.3167C139.002 36.6203 141.237 36.6203 144.408 37.3167C147.603 38.0182 151.315 40.2451 158.739 44.6986C175.071 54.4969 192.395 62.9301 210.351 69.2181C218.79 72.1733 223.01 73.6509 225.915 76.1888C228.407 78.3656 230.464 81.3793 231.582 84.4935C232.886 88.1245 232.761 91.5338 232.513 98.3519L232.438 100.199C231.577 119.555 227.903 147.407 215.502 172.621L214.703 174.221C197.744 207.645 170.168 229.632 153.722 240.549C150.054 242.984 148.221 244.201 144.765 245.027L144.292 245.127C141.98 245.565 138.259 245.565 135.947 245.127L135.474 245.027C132.45 244.305 130.668 243.282 127.813 241.407L126.517 240.549C110.071 229.632 82.4945 207.645 65.5354 174.221L64.7366 172.621C51.9359 146.593 48.433 117.756 47.7258 98.3519C47.4773 91.5338 47.3529 88.1245 48.6565 84.4935C49.7047 81.5737 51.578 78.7419 53.8616 76.6058L54.3235 76.1888C56.8659 73.9681 60.4146 72.5593 66.9153 70.262L69.8879 69.2181C87.2832 63.1266 104.084 55.0215 119.966 45.6126L121.5 44.6986C128.691 40.3845 132.399 38.1597 135.529 37.387L135.83 37.3167ZM142.693 45.1302C140.651 44.6821 139.587 44.6821 137.546 45.1302C137.011 45.2476 136.042 45.5797 134.011 46.6615C131.978 47.744 129.399 49.2889 125.615 51.5589C108.886 61.5949 91.0717 70.2754 72.5315 76.7679C68.2113 78.2808 65.3421 79.2905 63.1721 80.2171C61.0712 81.1143 60.1453 81.7249 59.5862 82.2132C58.1202 83.4937 56.8445 85.3647 56.1868 87.1966C55.5115 89.0774 55.4553 90.7725 55.7209 98.0609C56.4095 116.953 59.8253 144.507 71.9153 169.09C87.9039 201.6 114.779 223.155 130.941 233.884C134.649 236.346 135.416 236.788 137.332 237.245C137.667 237.325 138.69 237.455 140.119 237.455C141.549 237.455 142.572 237.325 142.906 237.245C144.823 236.788 145.59 236.346 149.298 233.884C165.46 223.155 192.335 201.6 208.323 169.09C220.413 144.507 223.829 116.953 224.518 98.0609C224.783 90.7725 224.727 89.0774 224.052 87.1966C223.394 85.3647 222.119 83.4937 220.653 82.2132C220.093 81.7249 219.168 81.1143 217.067 80.2171C214.897 79.2905 212.027 78.2808 207.707 76.7679C189.167 70.2755 171.352 61.5949 154.623 51.5589C150.839 49.2889 148.26 47.744 146.228 46.6615C144.197 45.5797 143.227 45.2476 142.693 45.1302Z';

const INNER_SHIELD_PATH =
    'M139.292 62.2562C139.834 62.1417 140.405 62.1417 140.947 62.2562C141.563 62.3864 142.136 62.7154 143.281 63.3724C153.768 69.3851 164.144 75.4839 175.113 80.6527C184.647 85.1455 194.499 88.8211 204.363 92.4925C205.9 93.0648 206.669 93.3514 207.237 93.8636C207.73 94.3088 208.12 94.8977 208.337 95.5257C208.587 96.2484 208.552 97.05 208.48 98.6527C207.505 120.384 203.613 142.415 193.966 162.03C182.725 184.885 164.435 203.892 143.631 218.384C142.41 219.235 141.8 219.66 141.083 219.838C140.474 219.99 139.765 219.989 139.156 219.838C138.439 219.66 137.828 219.235 136.607 218.384C115.803 203.892 97.5132 184.885 86.2727 162.03C76.6261 142.415 72.7338 120.384 71.759 98.6527C71.6872 97.0502 71.6507 96.2484 71.9006 95.5257C72.1178 94.8978 72.508 94.3088 73.0012 93.8636C73.569 93.3513 74.3386 93.0648 75.8762 92.4925C85.7445 88.8198 95.5676 85.1572 105.126 80.6527C116.094 75.4839 126.47 69.3851 136.956 63.3724C138.103 62.7152 138.676 62.3864 139.292 62.2562Z';

const TROPHY_PATH =
    'M123.475 87.0526C123.406 87.0526 123.332 87.0522 123.254 87.0518C122.509 87.0477 121.373 87.0414 120.327 87.3693C118.468 87.9526 116.936 89.3191 116.124 91.0664L106.584 91.0664C105.881 91.0662 105.111 91.066 104.439 91.1276C103.657 91.1993 102.696 91.3743 101.712 91.911C100.386 92.6348 99.2678 93.8645 98.6725 95.2531C97.9561 96.9244 98.1387 98.6865 98.2532 99.791C98.2643 99.8986 98.2748 99.9999 98.2838 100.094C100.02 118.385 111.312 133.238 128.649 137.77C130.296 139.599 132.058 141.165 133.91 142.484C134.825 143.136 135.808 143.593 136.804 143.891C136.781 144.128 136.754 144.37 136.725 144.615C136.434 147.044 135.898 149.34 135.098 150.896C133.462 151.003 131.778 151.21 130.185 151.612C126.812 152.463 123.363 154.313 121.641 158.316L121.607 158.395C121.448 158.761 121.204 159.327 121.067 159.937C120.892 160.722 120.904 161.467 121.051 162.241C121.212 163.093 121.625 163.857 121.961 164.367C122.296 164.877 122.835 165.559 123.554 166.043C125.078 167.071 126.725 167.061 127.937 167.054H127.939C128.036 167.053 128.131 167.053 128.222 167.053H151.779C151.871 167.053 151.966 167.053 152.064 167.054C153.277 167.061 154.924 167.071 156.448 166.043C157.167 165.559 157.705 164.877 158.041 164.367C158.377 163.857 158.79 163.093 158.951 162.241C159.097 161.467 159.11 160.722 158.934 159.937C158.798 159.327 158.553 158.761 158.395 158.395L158.361 158.316C156.638 154.313 153.19 152.463 149.816 151.612C148.223 151.21 146.54 151.003 144.903 150.896C144.104 149.34 143.568 147.044 143.277 144.615C143.247 144.37 143.221 144.128 143.197 143.891C144.194 143.593 145.177 143.136 146.092 142.484C147.954 141.158 149.725 139.581 151.381 137.739C168.693 133.182 179.984 118.407 181.719 100.094C181.728 99.9991 181.738 99.8978 181.749 99.7902C181.863 98.6854 182.046 96.9231 181.329 95.2522C180.734 93.8638 179.615 92.6345 178.289 91.9108C177.306 91.3742 176.345 91.1992 175.563 91.1276C174.891 91.066 174.121 91.0662 173.417 91.0664L163.878 91.0664C163.066 89.3191 161.534 87.9526 159.674 87.3693C158.629 87.0414 157.493 87.0477 156.747 87.0518C156.669 87.0522 156.596 87.0526 156.527 87.0526H123.475ZM106.702 99.0664H115.686C116.324 109.995 118.291 118.845 121.269 125.875C112.823 120.341 107.342 110.865 106.248 99.3382L106.222 99.0669C106.367 99.0665 106.525 99.0664 106.702 99.0664ZM158.747 125.841C161.717 118.817 163.679 109.978 164.316 99.0664H173.3C173.477 99.0664 173.635 99.0665 173.78 99.0669L173.754 99.3392C172.662 110.868 167.189 120.312 158.747 125.841Z';

const BANNER_TAIL_PATH =
    'M60.3717 182C64.8519 182 67.0921 182 68.8034 182.872C70.3086 183.639 71.5325 184.863 72.2995 186.368C73.1714 188.079 73.1715 190.32 73.1715 194.8V215.2C73.1715 219.68 73.1714 221.921 72.2995 223.632C71.5325 225.137 70.3086 226.361 68.8034 227.128C67.0921 228 64.8519 228 60.3717 228H43.6491C40.3833 228 38.7499 228 37.734 227.313C36.8463 226.711 36.2368 225.779 36.0426 224.725C35.8205 223.518 36.4758 222.022 37.7868 219.031L43.9372 205L37.7868 190.969C36.4758 187.978 35.8205 186.482 36.0426 185.275C36.2368 184.221 36.8463 183.289 37.734 182.688C38.7499 182 40.3833 182 43.6491 182H60.3717ZM236.063 182C239.329 182 240.962 182 241.978 182.688C242.866 183.289 243.475 184.221 243.67 185.275C243.892 186.482 243.235 187.978 241.924 190.969L235.775 205L241.924 219.031C243.235 222.022 243.892 223.518 243.67 224.725C243.475 225.779 242.866 226.711 241.978 227.313C240.962 228 239.329 228 236.063 228H219.34C214.86 228 212.62 228 210.909 227.128C209.404 226.361 208.18 225.137 207.413 223.632C206.541 221.921 206.541 219.68 206.541 215.2V194.8C206.541 190.32 206.541 188.079 207.413 186.368C208.18 184.863 209.404 183.639 210.909 182.872C212.62 182 214.86 182 219.34 182H236.063Z';

const BANNER_RECT = { x: 51.8555, y: 170, width: 176, height: 46, rx: 8 };

export default function AwardIcon({
    variant = 'platinum',
    text,
    size = 220,
    fontSize = 18,
    ...svgProps
}: AwardIconProps) {
    const palette = PALETTES[variant];
    const reactId = useId();

    const ids = useMemo(
        () => ({
            shieldClip: `shieldClip-${reactId}`,
            shieldLinear: `shieldLin-${reactId}`,
            shieldRadial: `shieldRad-${reactId}`,
            borderGradient: `borderGrad-${reactId}`,
            bannerLinear: `bannerLin-${reactId}`,
            bannerRadial: `bannerRad-${reactId}`,
        }),
        [reactId],
    );

    const width = size;
    const height = (size * 228) / 216;
    const bannerTextValue = text.trim().length === 0 ? ' ' : text.toUpperCase();

    return (
        <Svg width={width} height={height} viewBox="32 32 216 228" {...svgProps}>
            <Defs>
                <ClipPath id={ids.shieldClip}>
                    <Path d={SHIELD_PATH} />
                </ClipPath>

                <LinearGradient
                    id={ids.shieldLinear}
                    x1="140"
                    y1="37"
                    x2="140"
                    y2="245"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.35} />
                    <Stop offset="0.55" stopColor="#FFFFFF" stopOpacity={0} />
                    <Stop offset="1" stopColor="#000000" stopOpacity={0.08} />
                </LinearGradient>

                <RadialGradient
                    id={ids.shieldRadial}
                    cx="140"
                    cy="100"
                    rx="108"
                    ry="130"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.25} />
                    <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
                </RadialGradient>

                <LinearGradient
                    id={ids.borderGradient}
                    x1="140"
                    y1="37"
                    x2="140"
                    y2="245"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset="0" stopColor={palette.borderTop} />
                    <Stop offset="1" stopColor={palette.borderBottom} />
                </LinearGradient>

                <LinearGradient
                    id={ids.bannerLinear}
                    x1="140"
                    y1={BANNER_RECT.y}
                    x2="140"
                    y2={BANNER_RECT.y + BANNER_RECT.height}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.3} />
                    <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
                </LinearGradient>

                <RadialGradient
                    id={ids.bannerRadial}
                    cx="140"
                    cy="178"
                    rx="88"
                    ry="38"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.6} />
                    <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
                </RadialGradient>
            </Defs>

            {/* Drop shadow */}
            <Path
                d={SHIELD_PATH}
                fill="rgba(0,0,0,0.22)"
                transform="translate(0 10)"
            />

            {/* Shield base + overlays */}
            <G clipPath={`url(#${ids.shieldClip})`}>
                <Rect width="280" height="280" fill={palette.shieldBase} />
                <Rect
                    width="280"
                    height="280"
                    fill={`url(#${ids.shieldLinear})`}
                />
                <Rect
                    width="280"
                    height="280"
                    fill={`url(#${ids.shieldRadial})`}
                />
                <Rect width="280" height="280" fill="rgba(0,0,0,0.15)" />
                <Rect
                    x="0"
                    y="0"
                    width="140"
                    height="280"
                    fill="rgba(255,255,255,0.06)"
                />
            </G>

            {/* Shield border ring (outer→middle, evenodd) */}
            <Path
                d={BORDER_RING_PATH}
                fillRule="evenodd"
                fill={`url(#${ids.borderGradient})`}
            />

            {/* Inner shield outline */}
            <Path
                d={INNER_SHIELD_PATH}
                fill="none"
                stroke={palette.borderBottom}
                strokeWidth={1.5}
                strokeOpacity={0.4}
            />

            {/* Trophy shadow + fill */}
            <Path
                d={TROPHY_PATH}
                fill="rgba(0,0,0,0.10)"
                transform="translate(0 2)"
            />
            <Path d={TROPHY_PATH} fill={palette.trophy} />

            {/* Banner tails (drawn behind banner body) */}
            <Path d={BANNER_TAIL_PATH} fill={palette.bannerBase} />
            <Path d={BANNER_TAIL_PATH} fill="rgba(0,0,0,0.20)" />

            {/* Banner shadow */}
            <Rect
                x={BANNER_RECT.x}
                y={BANNER_RECT.y + 4}
                width={BANNER_RECT.width}
                height={BANNER_RECT.height}
                rx={BANNER_RECT.rx}
                fill="rgba(0,0,0,0.16)"
            />

            {/* Banner body */}
            <Rect
                x={BANNER_RECT.x}
                y={BANNER_RECT.y}
                width={BANNER_RECT.width}
                height={BANNER_RECT.height}
                rx={BANNER_RECT.rx}
                fill={palette.bannerBase}
            />
            <Rect
                x={BANNER_RECT.x}
                y={BANNER_RECT.y}
                width={BANNER_RECT.width}
                height={BANNER_RECT.height}
                rx={BANNER_RECT.rx}
                fill={`url(#${ids.bannerLinear})`}
            />
            <Rect
                x={BANNER_RECT.x}
                y={BANNER_RECT.y}
                width={BANNER_RECT.width}
                height={BANNER_RECT.height}
                rx={BANNER_RECT.rx}
                fill={`url(#${ids.bannerRadial})`}
            />

            {/* Banner rivets */}
            <Circle cx="62.8555" cy="193" r="3" fill="rgba(0,0,0,0.32)" />
            <Circle cx="216.855" cy="193" r="3" fill="rgba(0,0,0,0.32)" />

            {/* Banner text (main) */}
            <SvgText
                x="140"
                y="200"
                textAnchor="middle"
                fontSize={fontSize}
                fontWeight="900"
                letterSpacing={1.5}
                fill={palette.bannerText}
            >
                {bannerTextValue}
            </SvgText>
        </Svg>
    );
}
