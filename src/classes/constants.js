export const SVG_MARGIN = {top: 20, right: 90, bottom: 20, left: 90};

export const RECT_MARGIN = {right: 8, left: 8};
export const RECT_HEIGHT = 35;

export const TRIANGLE_HORIZONTAL_ROTATION=270;
export const TRIANGLE_BORDER_OFFSET=11;
export const MONOSPACE_HEIGHT_WIDTH_FACTOR = 0.6;
export const MANDATORY_CIRCLE_RADIUS = 6;
export const GROUP_SEGMENT_RADIUS = 25; // Radius of the segment that represents the 'alt' and 'and' groups.
export const FEATURE_FONT_SIZE = 16;
export const CHILDREN_COUNT_FONT_SIZE = 7;

export const PSEUDO_NODE_SIZE = 20;

export const GHOST_NODE_RADIUS_MOUSE = 15;
export const GHOST_NODE_RADIUS_TOUCH = 30;

export const QUICK_EDIT_RADIUS = 5;

export let CONSTRAINT_HIGHLIGHT_COLORS = [
    '#B762D9',
    '#FFB17A',
    '#AEE7C2',
    '#E2FBC5',
    '#F3C969',
    '#37FF8B',
    '#51D6FF',
    '#A0AECF',
    '#F4743B',
    '#F45B69',
];

export const COLORING_MAP = [
    "#4e78b5",
    "#6694c1",
    "#80b1cc",
    "#9dced6",
    "#c0eade",
    "#ffffe0",
    "#eb6574",
    "#d5405e",
    "#b81b4a",
    "#93003a",
];

export const STROKE_WIDTH_CONSTANT = 4;

export const NODE_COLOR = "rgb(204, 204, 255)";
export const NODE_EDITED_COLOR = "rgb(197,196,120)";
export const NODE_ABSTRACT_COLOR = "#ebebff";

export const NODE_DEAD_COLOR = "rgb(255, 46, 46)";

export const NODE_FALSEOP_COLOR = "rgb(255, 153, 51)";

export const NODE_CORE_COLOR = "rgb(51, 51, 255)";

export const DISPLAY_NAME_LENGTH = 8;
export const DISPLAY_NAME_RAW= 5;
export const POINTS = '...';
export const operators = {
    imp: "⇒",
    conj: "∧",
    disj: "∨",
    eq: "⇔",
    not: "¬",
};

export const EXAMPLE_FEATURE_MODEL_XML = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
\t<featureModel>
\t\t<properties/>
\t\t<struct>
\t\t\t<alt abstract="true" mandatory="true" name="BerkeleyDb">
\t\t\t\t<and abstract="true" name="BerkeleyDB">
\t\t\t\t\t<alt abstract="true" name="FLogging">
\t\t\t\t\t\t<and abstract="true" name="Logging">
\t\t\t\t\t\t\t<feature name="featureLoggingFile"/>
\t\t\t\t\t\t\t<feature name="featureLoggingConsole"/>
\t\t\t\t\t\t\t<feature name="featureLoggingDbLog"/>
\t\t\t\t\t\t\t<feature name="featureLoggingFinest"/>
\t\t\t\t\t\t\t<feature name="featureLoggingFiner"/>
\t\t\t\t\t\t\t<feature name="featureLoggingFine"/>
\t\t\t\t\t\t\t<feature name="featureLoggingInfo"/>
\t\t\t\t\t\t\t<feature name="featureLoggingConfig"/>
\t\t\t\t\t\t\t<feature name="featureLoggingSevere"/>
\t\t\t\t\t\t\t<feature mandatory="true" name="featureLoggingBase"/>
\t\t\t\t\t\t</and>
\t\t\t\t\t</alt>
\t\t\t\t\t<alt abstract="true" mandatory="true" name="FPersistency">
\t\t\t\t\t\t<and abstract="true" name="Persistency">
\t\t\t\t\t\t\t<or abstract="true" name="FPersistencyFeatures">
\t\t\t\t\t\t\t\t<feature name="featureChecksum"/>
\t\t\t\t\t\t\t\t<feature name="featureFileHandleCache"/>
\t\t\t\t\t\t\t\t<feature name="featureHandleFullDiscError"/>
\t\t\t\t\t\t\t\t<feature name="featureEnvironmentLock"/>
\t\t\t\t\t\t\t\t<and abstract="true" name="Checkpointer">
\t\t\t\t\t\t\t\t\t<feature name="featureCustomizableCheckpointerTime"/>
\t\t\t\t\t\t\t\t\t<feature name="featureCustomizableCheckpointerBytes"/>
\t\t\t\t\t\t\t\t\t<feature name="featureCheckpointerDaemon"/>
\t\t\t\t\t\t\t\t</and>
\t\t\t\t\t\t\t\t<and abstract="true" name="Cleaner">
\t\t\t\t\t\t\t\t\t<feature name="featureLookAheadCache"/>
\t\t\t\t\t\t\t\t\t<feature name="featureCleanerDaemon"/>
\t\t\t\t\t\t\t\t</and>
\t\t\t\t\t\t\t</or>
\t\t\t\t\t\t\t<alt abstract="true" mandatory="true" name="FIOFeature">
\t\t\t\t\t\t\t\t<and abstract="true" name="NIO">
\t\t\t\t\t\t\t\t\t<feature name="featureDirectNIO"/>
\t\t\t\t\t\t\t\t\t<alt abstract="true" mandatory="true" name="FNIOType">
\t\t\t\t\t\t\t\t\t\t<feature name="featureNIO"/>
\t\t\t\t\t\t\t\t\t\t<feature name="featureChunkedNIO"/>
\t\t\t\t\t\t\t\t\t</alt>
\t\t\t\t\t\t\t\t</and>
\t\t\t\t\t\t\t\t<and abstract="true" name="IO">
\t\t\t\t\t\t\t\t\t<feature name="featureSynchronizedIO"/>
\t\t\t\t\t\t\t\t\t<feature mandatory="true" name="featureIO"/>
\t\t\t\t\t\t\t\t</and>
\t\t\t\t\t\t\t</alt>
\t\t\t\t\t\t</and>
\t\t\t\t\t</alt>
\t\t\t\t\t<alt abstract="true" name="FStatistics">
\t\t\t\t\t\t<and abstract="true" name="Statistics">
\t\t\t\t\t\t\t<or abstract="true" mandatory="true" name="FStatisticsFeatures">
\t\t\t\t\t\t\t\t<and abstract="true" name="EnvStats">
\t\t\t\t\t\t\t\t\t<feature name="featureStatisticsEnvLog"/>
\t\t\t\t\t\t\t\t\t<feature name="featureStatisticsEnvINCompressor"/>
\t\t\t\t\t\t\t\t\t<feature name="featureStatisticsEnvFSync"/>
\t\t\t\t\t\t\t\t\t<feature name="featureStatisticsEnvEvictor"/>
\t\t\t\t\t\t\t\t\t<feature name="featureStatisticsEnvCleaner"/>
\t\t\t\t\t\t\t\t\t<feature name="featureStatisticsEnvCheckpointer"/>
\t\t\t\t\t\t\t\t\t<feature name="featureStatisticsEnvCaching"/>
\t\t\t\t\t\t\t\t\t<feature mandatory="true" name="featureStatisticsEnvBase"/>
\t\t\t\t\t\t\t\t</and>
\t\t\t\t\t\t\t\t<feature name="featureStatisticsDatabase"/>
\t\t\t\t\t\t\t\t<feature name="featureStatisticsLock"/>
\t\t\t\t\t\t\t\t<feature name="featureStatisticsPreload"/>
\t\t\t\t\t\t\t\t<feature name="featureStatisticsSequence"/>
\t\t\t\t\t\t\t\t<feature name="featureStatisticsTransaction"/>
\t\t\t\t\t\t\t</or>
\t\t\t\t\t\t\t<feature mandatory="true" name="featureStatisticsBase"/>
\t\t\t\t\t\t</and>
\t\t\t\t\t</alt>
\t\t\t\t\t<feature name="featureMemoryBudget"/>
\t\t\t\t\t<or abstract="true" name="FConcurrency">
\t\t\t\t\t\t<feature name="featureLatch"/>
\t\t\t\t\t\t<feature name="featureFSync"/>
\t\t\t\t\t\t<feature name="featureTransaction"/>
\t\t\t\t\t\t<feature name="dummyFeatureLocking"/>
\t\t\t\t\t\t<feature name="featureCheckLeaks"/>
\t\t\t\t\t</or>
\t\t\t\t\t<or abstract="true" name="FDbOperation">
\t\t\t\t\t\t<feature name="featureDeleteDb"/>
\t\t\t\t\t\t<feature name="featureTruncateDb"/>
\t\t\t\t\t</or>
\t\t\t\t\t<alt abstract="true" mandatory="true" name="FBtree">
\t\t\t\t\t\t<and abstract="true" name="BTree">
\t\t\t\t\t\t\t<feature name="featureVerifier"/>
\t\t\t\t\t\t\t<feature name="featureTreeVisitor"/>
\t\t\t\t\t\t\t<feature name="featureINCompressor"/>
\t\t\t\t\t\t\t<alt abstract="true" name="FEvictor">
\t\t\t\t\t\t\t\t<and abstract="true" name="Evictor">
\t\t\t\t\t\t\t\t\t<feature name="featureCriticalEviction"/>
\t\t\t\t\t\t\t\t\t<feature name="featureEvictorDaemon"/>
\t\t\t\t\t\t\t\t\t<feature mandatory="true" name="featureEvictor"/>
\t\t\t\t\t\t\t\t</and>
\t\t\t\t\t\t\t</alt>
\t\t\t\t\t\t</and>
\t\t\t\t\t</alt>
\t\t\t\t\t<feature mandatory="true" name="BASE"/>
\t\t\t\t</and>
\t\t\t</alt>
\t\t</struct>
\t\t<constraints>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<disj>
\t\t\t\t\t\t<var>featureEvictor</var>
\t\t\t\t\t\t<disj>
\t\t\t\t\t\t\t<var>featureEvictorDaemon</var>
\t\t\t\t\t\t\t<disj>
\t\t\t\t\t\t\t\t<var>featureLookAheadCache</var>
\t\t\t\t\t\t\t\t<var>featureStatisticsEnvCaching</var>
\t\t\t\t\t\t\t</disj>
\t\t\t\t\t\t</disj>
\t\t\t\t\t</disj>
\t\t\t\t\t<var>featureMemoryBudget</var>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<var>featureCheckLeaks</var>
\t\t\t\t\t<var>featureStatisticsLock</var>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<var>featureCriticalEviction</var>
\t\t\t\t\t<var>featureINCompressor</var>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<var>featureCustomizableCheckpointerBytes</var>
\t\t\t\t\t<var>featureCustomizableCheckpointerTime</var>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<var>featureDeleteDb</var>
\t\t\t\t\t<conj>
\t\t\t\t\t\t<var>dummyFeatureLocking</var>
\t\t\t\t\t\t<conj>
\t\t\t\t\t\t\t<var>featureEvictor</var>
\t\t\t\t\t\t\t<conj>
\t\t\t\t\t\t\t\t<var>featureINCompressor</var>
\t\t\t\t\t\t\t\t<var>featureMemoryBudget</var>
\t\t\t\t\t\t\t</conj>
\t\t\t\t\t\t</conj>
\t\t\t\t\t</conj>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<var>featureLatch</var>
\t\t\t\t\t<conj>
\t\t\t\t\t\t<var>dummyFeatureLocking</var>
\t\t\t\t\t\t<conj>
\t\t\t\t\t\t\t<var>featureCheckLeaks</var>
\t\t\t\t\t\t\t<conj>
\t\t\t\t\t\t\t\t<var>featureDeleteDb</var>
\t\t\t\t\t\t\t\t<conj>
\t\t\t\t\t\t\t\t\t<var>featureEvictor</var>
\t\t\t\t\t\t\t\t\t<conj>
\t\t\t\t\t\t\t\t\t\t<var>featureFileHandleCache</var>
\t\t\t\t\t\t\t\t\t\t<conj>
\t\t\t\t\t\t\t\t\t\t\t<var>featureFSync</var>
\t\t\t\t\t\t\t\t\t\t\t<conj>
\t\t\t\t\t\t\t\t\t\t\t\t<var>featureINCompressor</var>
\t\t\t\t\t\t\t\t\t\t\t\t<conj>
\t\t\t\t\t\t\t\t\t\t\t\t\t<var>featureMemoryBudget</var>
\t\t\t\t\t\t\t\t\t\t\t\t\t<conj>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<var>featureStatisticsLock</var>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<conj>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<var>featureTreeVisitor</var>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<conj>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<var>featureTruncateDb</var>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<var>featureVerifier</var>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</conj>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</conj>
\t\t\t\t\t\t\t\t\t\t\t\t\t</conj>
\t\t\t\t\t\t\t\t\t\t\t\t</conj>
\t\t\t\t\t\t\t\t\t\t\t</conj>
\t\t\t\t\t\t\t\t\t\t</conj>
\t\t\t\t\t\t\t\t\t</conj>
\t\t\t\t\t\t\t\t</conj>
\t\t\t\t\t\t\t</conj>
\t\t\t\t\t\t</conj>
\t\t\t\t\t</conj>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<var>featureLoggingSevere</var>
\t\t\t\t\t<var>featureEnvironmentLock</var>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<var>featureLoggingFine</var>
\t\t\t\t\t<conj>
\t\t\t\t\t\t<var>dummyFeatureLocking</var>
\t\t\t\t\t\t<conj>
\t\t\t\t\t\t\t<var>featureEvictor</var>
\t\t\t\t\t\t\t<var>featureINCompressor</var>
\t\t\t\t\t\t</conj>
\t\t\t\t\t</conj>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<var>featureLoggingInfo</var>
\t\t\t\t\t<conj>
\t\t\t\t\t\t<var>featureChecksum</var>
\t\t\t\t\t\t<var>featureMemoryBudget</var>
\t\t\t\t\t</conj>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<disj>
\t\t\t\t\t\t<var>featureLoggingBase</var>
\t\t\t\t\t\t<var>featureLoggingFinest</var>
\t\t\t\t\t</disj>
\t\t\t\t\t<var>featureTransaction</var>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<var>featureMemoryBudget</var>
\t\t\t\t\t<conj>
\t\t\t\t\t\t<var>featureEvictor</var>
\t\t\t\t\t\t<var>featureLatch</var>
\t\t\t\t\t</conj>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<disj>
\t\t\t\t\t\t<var>featureStatisticsLock</var>
\t\t\t\t\t\t<var>featureStatisticsTransaction</var>
\t\t\t\t\t</disj>
\t\t\t\t\t<var>dummyFeatureLocking</var>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<var>featureStatisticsEnvEvictor</var>
\t\t\t\t\t<var>featureEvictor</var>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<var>featureStatisticsEnvFSync</var>
\t\t\t\t\t<var>featureFSync</var>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<var>featureStatisticsEnvINCompressor</var>
\t\t\t\t\t<var>featureINCompressor</var>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<var>featureStatisticsTransaction</var>
\t\t\t\t\t<var>featureTransaction</var>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<var>featureStatisticsDatabase</var>
\t\t\t\t\t<var>featureTreeVisitor</var>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<var>featureTransaction</var>
\t\t\t\t\t<conj>
\t\t\t\t\t\t<var>dummyFeatureLocking</var>
\t\t\t\t\t\t<conj>
\t\t\t\t\t\t\t<var>featureDeleteDb</var>
\t\t\t\t\t\t\t<var>featureTruncateDb</var>
\t\t\t\t\t\t</conj>
\t\t\t\t\t</conj>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<var>featureTruncateDb</var>
\t\t\t\t\t<var>featureDeleteDb</var>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t\t<rule>
\t\t\t\t<imp>
\t\t\t\t\t<var>featureVerifier</var>
\t\t\t\t\t<conj>
\t\t\t\t\t\t<var>featureINCompressor</var>
\t\t\t\t\t\t<var>featureTreeVisitor</var>
\t\t\t\t\t</conj>
\t\t\t\t</imp>
\t\t\t</rule>
\t\t</constraints>
\t\t<calculations Auto="true" Constraints="true" Features="true" Redundant="true" Tautology="true"/>
\t\t<comments>
\t\t\t<c>Semantic Dependencies</c>
\t\t</comments>
\t\t<featureOrder userDefined="false"/>
\t</featureModel>
`;
