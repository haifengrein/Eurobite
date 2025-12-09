import { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
  token: {
    // Brand Colors
    colorPrimary: '#F97316', // Orange-500
    colorInfo: '#F97316',
    
    // Semantic Colors (Softer)
    colorSuccess: '#10B981', // Emerald-500
    colorWarning: '#F59E0B', // Amber-500
    colorError: '#EF4444', // Red-500
    
    // Typography
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    
    // Spacing & Radius
    borderRadius: 8,
    borderRadiusLG: 12,
    
    // Base Colors
    colorBgBase: '#ffffff',
    colorTextBase: '#18181B', // Zinc-900
    colorBorder: '#E4E4E7', // Zinc-200
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#FAFAFA', // Zinc-50
      siderBg: '#ffffff',
      headerPadding: '0 24px',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#FFF7ED', // Orange-50
      itemSelectedColor: '#F97316', // Orange-500
      activeBarBorderWidth: 0, // Remove the left border bar
      itemBorderRadius: 8,
      itemMarginInline: 8,
    },
    Card: {
      headerFontSize: 16,
      headerFontWeight: 600,
      actionsLiMargin: '0',
    },
    Button: {
      fontWeight: 500,
      contentFontSize: 14,
      controlHeight: 36, // Taller buttons
      defaultShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      primaryShadow: '0 1px 2px 0 rgba(249, 115, 22, 0.1)',
    },
    Table: {
      headerBg: '#FAFAFA',
      headerColor: '#71717A', // Zinc-500
      headerSplitColor: 'transparent',
      rowHoverBg: '#FFF7ED',
    },
    Input: {
      controlHeight: 40,
      activeShadow: '0 0 0 2px rgba(249, 115, 22, 0.1)',
    }
  },
};