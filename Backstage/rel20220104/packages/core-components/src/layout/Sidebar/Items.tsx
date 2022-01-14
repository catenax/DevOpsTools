/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { IconComponent, useElementFilter } from '@backstage/core-plugin-api';
import { BackstageTheme } from '@backstage/theme';
import { makeStyles, styled, Theme } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { CreateCSSProperties } from '@material-ui/core/styles/withStyles';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import SearchIcon from '@material-ui/icons/Search';
import classnames from 'classnames';
import React, {
  Children,
  forwardRef,
  KeyboardEventHandler,
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from 'react';
import {
  Link,
  NavLinkProps,
  resolvePath,
  useLocation,
  useResolvedPath,
} from 'react-router-dom';
import {
  sidebarConfig,
  SidebarContext,
  SidebarItemWithSubmenuContext,
} from './config';
import { SidebarSubmenu } from './SidebarSubmenu';
import { isLocationMatch } from './utils';
import { Location } from 'history';

export type SidebarItemClassKey =
  | 'root'
  | 'buttonItem'
  | 'closed'
  | 'open'
  | 'label'
  | 'iconContainer'
  | 'searchRoot'
  | 'searchField'
  | 'searchFieldHTMLInput'
  | 'searchContainer'
  | 'secondaryAction'
  | 'selected';

const useStyles = makeStyles<BackstageTheme>(
  theme => {
    const {
      selectedIndicatorWidth,
      drawerWidthClosed,
      drawerWidthOpen,
      iconContainerWidth,
    } = sidebarConfig;
    return {
      root: {
        color: theme.palette.navigation.color,
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',
        height: 48,
        cursor: 'pointer',
      },
      buttonItem: {
        background: 'none',
        border: 'none',
        width: 'auto',
        margin: 0,
        padding: 0,
        textAlign: 'inherit',
        font: 'inherit',
      },
      closed: {
        width: drawerWidthClosed,
        justifyContent: 'center',
      },
      open: {
        width: drawerWidthOpen,
      },
      highlightable: {
        '&:hover': {
          background:
            theme.palette.navigation.navItem?.hoverBackground ?? '#404040',
        },
      },
      highlighted: {
        background:
          theme.palette.navigation.navItem?.hoverBackground ?? '#404040',
      },
      label: {
        // XXX (@koroeskohr): I can't seem to achieve the desired font-weight from the designs
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        lineHeight: 'auto',
        flex: '3 1 auto',
        width: '110px',
        overflow: 'hidden',
        'text-overflow': 'ellipsis',
      },
      iconContainer: {
        boxSizing: 'border-box',
        height: '100%',
        width: iconContainerWidth,
        marginRight: -theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      searchRoot: {
        marginBottom: 12,
      },
      searchField: {
        color: '#b5b5b5',
        fontWeight: 'bold',
        fontSize: theme.typography.fontSize,
      },
      searchFieldHTMLInput: {
        padding: `${theme.spacing(2)} 0 ${theme.spacing(2)}`,
      },
      searchContainer: {
        width: drawerWidthOpen - iconContainerWidth,
      },
      secondaryAction: {
        width: theme.spacing(6),
        textAlign: 'center',
        marginRight: theme.spacing(1),
      },
      closedItemIcon: {
        width: '100%',
        justifyContent: 'center',
      },
      submenuArrow: {
        position: 'absolute',
        right: 0,
      },
      selected: {
        '&$root': {
          borderLeft: `solid ${selectedIndicatorWidth}px ${theme.palette.navigation.indicator}`,
          color: theme.palette.navigation.selectedColor,
        },
        '&$closed': {
          width: drawerWidthClosed,
        },
        '& $closedItemIcon': {
          paddingRight: selectedIndicatorWidth,
        },
        '& $iconContainer': {
          marginLeft: -selectedIndicatorWidth,
        },
      },
    };
  },
  { name: 'BackstageSidebarItem' },
);

function isSidebarItemWithSubmenuActive(
  submenu: ReactNode,
  currentLocation: Location,
) {
  // Item is active if any of submenu items have active paths
  const toPathnames: string[] = [];
  let isActive = false;
  let submenuItems: ReactNode;
  Children.forEach(submenu, element => {
    if (!React.isValidElement(element)) return;
    submenuItems = element.props.children;
  });
  Children.forEach(submenuItems, element => {
    if (!React.isValidElement(element)) return;
    if (element.props.dropdownItems) {
      element.props.dropdownItems.map((item: { to: string }) =>
        toPathnames.push(item.to),
      );
    } else if (element.props.to) {
      toPathnames.push(element.props.to);
    }
  });
  isActive = toPathnames.some(to => {
    const toLocation = resolvePath(to);
    return isLocationMatch(currentLocation, toLocation);
  });
  return isActive;
}

const SidebarItemWithSubmenu = ({
  text,
  hasNotifications = false,
  icon: Icon,
  children,
}: PropsWithChildren<SidebarItemWithSubmenuProps>) => {
  const classes = useStyles();
  const [isHoveredOn, setIsHoveredOn] = useState(false);
  const currentLocation = useLocation();
  const isActive = isSidebarItemWithSubmenuActive(children, currentLocation);

  const handleMouseEnter = () => {
    setIsHoveredOn(true);
  };
  const handleMouseLeave = () => {
    setIsHoveredOn(false);
  };

  const { isOpen } = useContext(SidebarContext);
  const itemIcon = (
    <Badge
      color="secondary"
      variant="dot"
      overlap="circular"
      className={isOpen ? '' : classes.closedItemIcon}
      invisible={!hasNotifications}
    >
      <Icon fontSize="small" />
    </Badge>
  );
  const openContent = (
    <>
      <div data-testid="login-button" className={classes.iconContainer}>
        {itemIcon}
      </div>
      {text && (
        <Typography variant="subtitle2" className={classes.label}>
          {text}
        </Typography>
      )}
      <div className={classes.secondaryAction}>{}</div>
    </>
  );
  const closedContent = itemIcon;

  return (
    <SidebarItemWithSubmenuContext.Provider
      value={{
        isHoveredOn,
        setIsHoveredOn,
      }}
    >
      <div
        onMouseLeave={handleMouseLeave}
        className={classnames(isHoveredOn && classes.highlighted)}
      >
        <div
          onMouseEnter={handleMouseEnter}
          data-testid="item-with-submenu"
          className={classnames(
            classes.root,
            isOpen ? classes.open : classes.closed,
            isActive && classes.selected,
            classes.highlightable,
            isHoveredOn && classes.highlighted,
          )}
        >
          {isOpen ? openContent : closedContent}
          {!isHoveredOn && (
            <ArrowRightIcon fontSize="small" className={classes.submenuArrow} />
          )}
        </div>
        {isHoveredOn && children}
      </div>
    </SidebarItemWithSubmenuContext.Provider>
  );
};

type SidebarItemBaseProps = {
  icon: IconComponent;
  text?: string;
  hasNotifications?: boolean;
  disableHighlight?: boolean;
  className?: string;
};

type SidebarItemButtonProps = SidebarItemBaseProps & {
  onClick: (ev: React.MouseEvent) => void;
  children?: ReactNode;
};

type SidebarItemLinkProps = SidebarItemBaseProps & {
  to: string;
  onClick?: (ev: React.MouseEvent) => void;
} & NavLinkProps;

type SidebarItemWithSubmenuProps = SidebarItemBaseProps & {
  to?: string;
  onClick?: (ev: React.MouseEvent) => void;
  children: ReactNode;
};

/**
 * SidebarItem with 'to' property will be a clickable link.
 * SidebarItem with 'onClick' property and without 'to' property will be a clickable button.
 * SidebarItem which wraps a SidebarSubmenu will be a clickable button which opens a submenu.
 */
type SidebarItemProps =
  | SidebarItemLinkProps
  | SidebarItemButtonProps
  | SidebarItemWithSubmenuProps;

function isButtonItem(
  props: SidebarItemProps,
): props is SidebarItemButtonProps {
  return (props as SidebarItemLinkProps).to === undefined;
}

// TODO(Rugvip): Remove this once NavLink is updated in react-router-dom.
//               This is needed because react-router doesn't handle the path comparison
//               properly yet, matching for example /foobar with /foo.
export const WorkaroundNavLink = React.forwardRef<
  HTMLAnchorElement,
  NavLinkProps
>(function WorkaroundNavLinkWithRef(
  {
    to,
    end,
    style,
    className,
    activeStyle,
    caseSensitive,
    activeClassName = 'active',
    'aria-current': ariaCurrentProp = 'page',
    ...rest
  },
  ref,
) {
  let { pathname: locationPathname } = useLocation();
  let { pathname: toPathname } = useResolvedPath(to);

  if (!caseSensitive) {
    locationPathname = locationPathname.toLocaleLowerCase('en-US');
    toPathname = toPathname.toLocaleLowerCase('en-US');
  }

  let isActive = locationPathname === toPathname;
  if (!isActive && !end) {
    // This is the behavior that is different from the original NavLink
    isActive = locationPathname.startsWith(`${toPathname}/`);
  }

  const ariaCurrent = isActive ? ariaCurrentProp : undefined;

  return (
    <Link
      {...rest}
      to={to}
      ref={ref}
      aria-current={ariaCurrent}
      style={{ ...style, ...(isActive ? activeStyle : undefined) }}
      className={classnames([
        className,
        isActive ? activeClassName : undefined,
      ])}
    />
  );
});

export const SidebarItem = forwardRef<any, SidebarItemProps>((props, ref) => {
  const {
    icon: Icon,
    text,
    hasNotifications = false,
    disableHighlight = false,
    onClick,
    children,
    className,
    ...navLinkProps
  } = props;
  const classes = useStyles();
  // XXX (@koroeskohr): unsure this is optimal. But I just really didn't want to have the item component
  // depend on the current location, and at least have it being optionally forced to selected.
  // Still waiting on a Q answered to fine tune the implementation
  const { isOpen } = useContext(SidebarContext);

  const itemIcon = (
    <Badge
      color="secondary"
      variant="dot"
      overlap="circular"
      invisible={!hasNotifications}
      className={classnames({ [classes.closedItemIcon]: !isOpen })}
    >
      <Icon fontSize="small" />
    </Badge>
  );

  const closedContent = itemIcon;

  const openContent = (
    <>
      <div data-testid="login-button" className={classes.iconContainer}>
        {itemIcon}
      </div>
      {text && (
        <Typography variant="subtitle2" className={classes.label}>
          {text}
        </Typography>
      )}
      <div className={classes.secondaryAction}>{children}</div>
    </>
  );

  const content = isOpen ? openContent : closedContent;

  const childProps = {
    onClick,
    className: classnames(
      className,
      classes.root,
      isOpen ? classes.open : classes.closed,
      isButtonItem(props) && classes.buttonItem,
      { [classes.highlightable]: !disableHighlight },
    ),
  };

  let hasSubmenu = false;
  let submenu: ReactNode;
  const componentType = (
    <SidebarSubmenu>
      <></>
    </SidebarSubmenu>
  ).type;
  // Filter children for SidebarSubmenu components
  const submenus = useElementFilter(children, elements =>
    elements.getElements().filter(child => child.type === componentType),
  );
  // Error thrown if more than one SidebarSubmenu in a SidebarItem
  if (submenus.length > 1) {
    throw new Error(
      'Cannot render more than one SidebarSubmenu inside a SidebarItem',
    );
  } else if (submenus.length === 1) {
    hasSubmenu = true;
    submenu = submenus[0];
  }

  if (hasSubmenu) {
    return (
      <SidebarItemWithSubmenu
        text={text}
        icon={Icon}
        hasNotifications={hasNotifications}
      >
        {submenu}
      </SidebarItemWithSubmenu>
    );
  }

  if (isButtonItem(props)) {
    return (
      <button aria-label={text} {...childProps} ref={ref}>
        {content}
      </button>
    );
  }

  return (
    <WorkaroundNavLink
      {...childProps}
      activeClassName={classes.selected}
      to={props.to ? props.to : ''}
      ref={ref}
      aria-label={text ? text : props.to}
      {...navLinkProps}
    >
      {content}
    </WorkaroundNavLink>
  );
});

type SidebarSearchFieldProps = {
  onSearch: (input: string) => void;
  to?: string;
  icon?: IconComponent;
};

export function SidebarSearchField(props: SidebarSearchFieldProps) {
  const [input, setInput] = useState('');
  const classes = useStyles();
  const Icon = props.icon ? props.icon : SearchIcon;

  const search = () => {
    props.onSearch(input);
    setInput('');
  };

  const handleEnter: KeyboardEventHandler = ev => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      search();
    }
  };

  const handleInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setInput(ev.target.value);
  };

  const handleInputClick = (ev: React.MouseEvent<HTMLInputElement>) => {
    // Clicking into the search fields shouldn't navigate to the search page
    ev.preventDefault();
    ev.stopPropagation();
  };

  const handleItemClick = (ev: React.MouseEvent) => {
    // Clicking on the search icon while should execute a query with the current field content
    search();
    ev.preventDefault();
  };

  return (
    <div className={classes.searchRoot}>
      <SidebarItem
        icon={Icon}
        to={props.to}
        onClick={handleItemClick}
        disableHighlight
      >
        <TextField
          placeholder="Search"
          value={input}
          onClick={handleInputClick}
          onChange={handleInput}
          onKeyDown={handleEnter}
          className={classes.searchContainer}
          InputProps={{
            disableUnderline: true,
            className: classes.searchField,
          }}
          inputProps={{
            className: classes.searchFieldHTMLInput,
          }}
        />
      </SidebarItem>
    </div>
  );
}

export type SidebarSpaceClassKey = 'root';

export const SidebarSpace = styled('div')(
  {
    flex: 1,
  },
  { name: 'BackstageSidebarSpace' },
);

export type SidebarSpacerClassKey = 'root';

export const SidebarSpacer = styled('div')(
  {
    height: 8,
  },
  { name: 'BackstageSidebarSpacer' },
);

export type SidebarDividerClassKey = 'root';

export const SidebarDivider = styled('hr')(
  {
    height: 1,
    width: '100%',
    background: '#383838',
    border: 'none',
    margin: '12px 0px',
  },
  { name: 'BackstageSidebarDivider' },
);

const styledScrollbar = (theme: Theme): CreateCSSProperties => ({
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    backgroundColor: theme.palette.background.default,
    width: '5px',
    borderRadius: '5px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.text.hint,
    borderRadius: '5px',
  },
});

export const SidebarScrollWrapper = styled('div')(({ theme }) => {
  const scrollbarStyles = styledScrollbar(theme);
  return {
    flex: '0 1 auto',
    overflowX: 'hidden',
    // 5px space to the right of the scrollbar
    width: 'calc(100% - 5px)',
    // Display at least one item in the container
    // Question: Can this be a config/theme variable - if so, which? :/
    minHeight: '48px',
    overflowY: 'hidden',
    '@media (hover: none)': scrollbarStyles,
    '&:hover': scrollbarStyles,
  };
});
